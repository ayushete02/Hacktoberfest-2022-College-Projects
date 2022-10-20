package com.simplicitydev.smartrailwayqr;

import android.Manifest;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Point;
import android.os.Environment;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Display;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.zxing.WriterException;
import java.util.HashMap;
import java.util.Map;
import androidmads.library.qrgenearator.QRGContents;
import androidmads.library.qrgenearator.QRGEncoder;
import androidmads.library.qrgenearator.QRGSaver;

public class QRCode extends AppCompatActivity {

    private static final String IMAGE_DIRECTORY =  Environment.getExternalStorageDirectory().getPath() + "/SmartRailwayQR/";

    String TAG = "GenerateQrCode";

    ImageView qrimg;
    Bitmap mBitmap;

    QRGEncoder mQRGEncoder;

    Button mm, exit,save;

    /*FirebaseDatabase database=FirebaseDatabase.getInstance();
    DatabaseReference reference= database.getReference("passengers");*/

    RequestQueue mRequestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.activity_qrcode);

        final Passenger mPassenger = (Passenger) getIntent().getSerializableExtra("passenger");
        final String input = mPassenger.getPnr();

        qrimg = findViewById(R.id.qr);
        mm = findViewById(R.id.main_menu);
        exit = findViewById(R.id.close);
        save=findViewById(R.id.save_img);

        mRequestQueue= Volley.newRequestQueue(this);

        //Toast.makeText(this, input, Toast.LENGTH_LONG).show();

        final ProgressDialog pd = new ProgressDialog(QRCode.this);
        pd.setMessage("Please Wait...");
        pd.setCanceledOnTouchOutside(false);
        pd.show();

        /*String cName=reference.push().getKey();
        reference.child(cName).setValue(mPassenger);*/

        StringRequest serverRq=new StringRequest(Request.Method.POST, "http://15.207.50.169/setdata.php", new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                WindowManager windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
                Display display = windowManager.getDefaultDisplay();
                Point point = new Point();
                display.getSize(point);
                int width = point.x;
                int height = point.y;
                int smallerdimen = width < height ? width : height;
                smallerdimen = smallerdimen * 3 / 4;
                mQRGEncoder = new QRGEncoder(input, null, QRGContents.Type.TEXT, smallerdimen);

                try {
                    mBitmap = mQRGEncoder.encodeAsBitmap();
                    qrimg.setImageBitmap(mBitmap);
                } catch (WriterException e) {
                    Log.v(TAG, e.toString());
                }
                pd.dismiss();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        })
        {
            @Override
            public Map<String, String> getParams() throws AuthFailureError {

                Map<String,String> data=new HashMap<>();

                data.put("pnr",mPassenger.getPnr());
                data.put("name",mPassenger.getName());
                data.put("trainname",mPassenger.getTrainname());
                data.put("trainno",mPassenger.getTrainno());
                data.put("state",mPassenger.getState());
                data.put("city",mPassenger.getCity());
                data.put("source",mPassenger.getSource());
                data.put("destination",mPassenger.getDestination());
                data.put("date",mPassenger.getDate());
                data.put("aadhaar",mPassenger.getAadhaar());
                data.put("mobile",mPassenger.getMobile());

                return data;
            }
        };

        mRequestQueue.add(serverRq);


        save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try{
                    QRGSaver.save(IMAGE_DIRECTORY,input.trim(),mBitmap,QRGContents.ImageType.IMAGE_JPEG);
                }

                catch (Exception e){
                    e.printStackTrace();
                }

                AlertDialog.Builder ab=new AlertDialog.Builder(QRCode.this);
                ab.setTitle("Info");
                ab.setMessage("File Saved to "+IMAGE_DIRECTORY);
                ab.setPositiveButton("OK",null);
                ab.show();
            }
        });

        mm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(QRCode.this, Home.class);
                startActivity(i);
                finish();
            }
        });

        exit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finishAffinity();
            }
        });

    }

}
