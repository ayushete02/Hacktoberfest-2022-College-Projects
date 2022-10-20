package com.simplicitydev.smartrailwayqr;

import android.Manifest;
import android.app.AlertDialog;

import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.Toast;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.zxing.Result;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.UUID;

import me.dm7.barcodescanner.zxing.ZXingScannerView;

public class ScanQR extends AppCompatActivity implements ZXingScannerView.ResultHandler {

    private static final String TAG = "BlueTest5-Controlling";
    private int mMaxChars = 50000;//Default//change this to string..........
    private UUID mDeviceUUID;
    private BluetoothSocket mBTSocket;
    private ScanQR.ReadInput mReadThread = null;

    private boolean mIsUserInitiatedDisconnect = false;
    private boolean mIsBluetoothConnected = false;


    private Button mBtnDisconnect;
    private BluetoothDevice mDevice;

    final static String on="Valid Passenger";//on
    final static String off="Thank you";//off

    final static String on2="Invalid Passenger";//on
    final static String off2="Thank you";//off


    private ProgressDialog progressDialog;

    ZXingScannerView mScannerView;

    ArrayList<String> f;
    int flag=0,j;

    FirebaseDatabase database;
    DatabaseReference reference;

    RequestQueue mRequestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);

        mScannerView=new ZXingScannerView(this);
        setContentView(mScannerView);

       // com.simplicitydev.smartrailwayqr.ActivityHelper.initialize(this);

        Intent intent = getIntent();
        Bundle b = intent.getExtras();
        mDevice = b.getParcelable(Bluetooth.DEVICE_EXTRA);
        mDeviceUUID = UUID.fromString(b.getString(Bluetooth.DEVICE_UUID));
        mMaxChars = b.getInt(Bluetooth.BUFFER_SIZE);

        Log.d(TAG, "Ready");


        database=FirebaseDatabase.getInstance();
        reference=database.getReference("passengers");


        mRequestQueue= Volley.newRequestQueue(this);

        if(ActivityCompat.checkSelfPermission(ScanQR.this, Manifest.permission.CAMERA)!= PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(ScanQR.this,new String[]{Manifest.permission.CAMERA},0);
            return;
        }


    }

    public class ReadInput implements Runnable {

        private boolean bStop = false;
        private Thread t;

        public ReadInput() {
            t = new Thread(this, "Input Thread");
            t.start();
        }

        public boolean isRunning() {
            return t.isAlive();
        }

        @Override
        public void run() {
            InputStream inputStream;

            try {
                inputStream = mBTSocket.getInputStream();
                while (!bStop) {
                    byte[] buffer = new byte[256];
                    if (inputStream.available() > 0) {
                        inputStream.read(buffer);
                        int i = 0;
                        /*
                         * This is needed because new String(buffer) is taking the entire buffer i.e. 256 chars on Android 2.3.4 http://stackoverflow.com/a/8843462/1287554
                         */
                        for (i = 0; i < buffer.length && buffer[i] != 0; i++) {
                        }
                        final String strInput = new String(buffer, 0, i);

                        /*
                         * If checked then receive text, better design would probably be to stop thread if unchecked and free resources, but this is a quick fix
                         */



                    }
                    Thread.sleep(500);
                }
            } catch (IOException e) {
// TODO Auto-generated catch block
                e.printStackTrace();
            } catch (InterruptedException e) {
// TODO Auto-generated catch block
                e.printStackTrace();
            }

        }

        public void stop() {
            bStop = true;
        }

    }

    public class DisConnectBT extends AsyncTask<Void, Void, Void> {

        @Override
        protected void onPreExecute() {
        }

        @Override
        protected Void doInBackground(Void... params) {//cant inderstand these dotss

            if (mReadThread != null) {
                mReadThread.stop();
                while (mReadThread.isRunning())
                    ; // Wait until it stops
                mReadThread = null;

            }

            try {
                mBTSocket.close();
            } catch (IOException e) {
// TODO Auto-generated catch block
                e.printStackTrace();
            }

            return null;
        }

        @Override
        protected void onPostExecute(Void result) {
            super.onPostExecute(result);
            mIsBluetoothConnected = false;
            if (mIsUserInitiatedDisconnect) {
                finish();
            }
        }

    }

    private void msg(String s) {
        Toast.makeText(getApplicationContext(), s, Toast.LENGTH_SHORT).show();
    }




    @Override
    protected void onStop() {
        Log.d(TAG, "Stopped");
        super.onStop();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
// TODO Auto-generated method stub
        super.onSaveInstanceState(outState);
    }

    public class ConnectBT extends AsyncTask<Void, Void, Void> {
        private boolean mConnectSuccessful = true;

        @Override
        protected void onPreExecute() {

            progressDialog = ProgressDialog.show(ScanQR.this, "Hold on", "Connecting");// http://stackoverflow.com/a/11130220/1287554

        }

        @Override
        protected Void doInBackground(Void... devices) {

            try {
                if (mBTSocket == null || !mIsBluetoothConnected) {
                    mBTSocket = mDevice.createInsecureRfcommSocketToServiceRecord(mDeviceUUID);
                    BluetoothAdapter.getDefaultAdapter().cancelDiscovery();
                    mBTSocket.connect();
                }
            } catch (IOException e) {
// Unable to connect to device`
                // e.printStackTrace();
                mConnectSuccessful = false;



            }
            return null;
        }

        @Override
        protected void onPostExecute(Void result) {
            super.onPostExecute(result);

            if (!mConnectSuccessful) {
                Toast.makeText(getApplicationContext(), "Could not connect to device.Please turn on your Hardware", Toast.LENGTH_LONG).show();
                finish();
            } else {
                msg("Connected to device");
                mIsBluetoothConnected = true;
                mReadThread = new ScanQR.ReadInput(); // Kick off input reader
            }

            progressDialog.dismiss();
        }

    }
    @Override
    protected void onDestroy() {
        // TODO Auto-generated method stub
        super.onDestroy();
    }

    @Override
    public void handleResult(Result result) {
        Home.mTextView.setText(result.getText());

        f=new ArrayList<>();
        StringRequest serverRq=new StringRequest(Request.Method.POST, "http://15.207.50.169/getdata.php", new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try{
                    JSONObject obj=new JSONObject(response);
                    JSONArray jsonArray=obj.getJSONArray("result");

                    for(int i=0;i<jsonArray.length();i++){
                        JSONObject o=jsonArray.getJSONObject(i);
                        String h=o.getString("pnr");
                        f.add(h);
                    }
                }
                catch (Exception e){}

                if(Home.mTextView.getText().toString().length()!=10)
                {
                    flag=0;
                }

                else {
                    for (j = 0; j < f.size(); j++) {
                        String b = f.get(j);
                        if (b.equals(Home.mTextView.getText().toString())) {
                            flag = 1;
                            break;
                        }
                    }
                }


                if(flag==1){
                    AlertDialog.Builder ab=new AlertDialog.Builder(ScanQR.this);
                    ab.setTitle("Info");
                    ab.setMessage("Passenger Verified");
                    ab.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            try {
                                mBTSocket.getOutputStream().write(off.getBytes());
                            } catch (IOException e) {
                                // TODO Auto-generated catch block
                                e.printStackTrace();
                            }
                            Intent j=new Intent(ScanQR.this,Home.class);
                            startActivity(j);
                        }
                    });

                    ab.show();

                    try {
                        mBTSocket.getOutputStream().write(on.getBytes());

                    } catch (IOException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }

                else{
                    AlertDialog.Builder ab=new AlertDialog.Builder(ScanQR.this);
                    ab.setTitle("Info");
                    ab.setMessage("Invalid Input");
                    ab.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            try {
                                mBTSocket.getOutputStream().write(off2.getBytes());
                            } catch (IOException e) {
                                // TODO Auto-generated catch block
                                e.printStackTrace();
                            }
                            Intent j=new Intent(ScanQR.this,Home.class);
                            startActivity(j);
                        }
                    });

                    ab.show();

                    try {
                        mBTSocket.getOutputStream().write(on2.getBytes());
                    } catch (IOException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }

                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });
        mRequestQueue.add(serverRq);
        /*reference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for(DataSnapshot d:dataSnapshot.getChildren()){
                    Passenger p=d.getValue(Passenger.class);
                    f.add(p);
                }

                if(Home.mTextView.getText().toString().length()!=10)
                {
                    flag=0;
                }

                else {
                    for (j = 0; j < f.size(); j++) {
                        String b = f.get(j).getPnr();
                        if (b.equals(Home.mTextView.getText().toString())) {
                            flag = 1;
                            break;
                        }
                    }
                }


                if(flag==1){
                    AlertDialog.Builder ab=new AlertDialog.Builder(ScanQR.this);
                    ab.setTitle("Info");
                    ab.setMessage("Passenger Verified");
                    ab.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            Intent j=new Intent(ScanQR.this,Home.class);
                            startActivity(j);
                        }
                    });

                    ab.show();
                }

                else{
                    AlertDialog.Builder ab=new AlertDialog.Builder(ScanQR.this);
                    ab.setTitle("Info");
                    ab.setMessage("Invalid Input");
                    ab.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            Intent j=new Intent(ScanQR.this,Home.class);
                            startActivity(j);
                        }
                    });

                    ab.show();
                }

            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Toast.makeText(ScanQR.this, ""+databaseError.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });*/

    }

    @Override
    protected void onPause() {
        super.onPause();

        mScannerView.stopCamera();
        if (mBTSocket != null && mIsBluetoothConnected) {
            new ScanQR.DisConnectBT().execute();
        }
        Log.d(TAG, "Paused");
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mBTSocket == null || !mIsBluetoothConnected) {
            new ScanQR.ConnectBT().execute();
        }
        Log.d(TAG, "Resumed");
        mScannerView.setResultHandler(this);
        mScannerView.startCamera();
    }
}
