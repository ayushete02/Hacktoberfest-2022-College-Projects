package com.simplicitydev.smartrailwayqr;

import android.Manifest;
import android.app.DatePickerDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Toast;
import java.util.Calendar;
import java.util.Random;

public class GenerateQR extends AppCompatActivity {

    EditText name_o_p,tr_name,tr_no,st,ct,sr,dest,doj,adh_no,mob_no;
    int d,m,y;

    String name,trainname,trainno,state,city,source,destination,date,aadhaar,mobile;
    Button sc_fg;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.activity_generate_qr);


        sc_fg=findViewById(R.id.fingerp);


        name_o_p=findViewById(R.id.name);
        tr_name=findViewById(R.id.train_name);
        tr_no=findViewById(R.id.train_no);
        st=findViewById(R.id.st_name);
        ct=findViewById(R.id.city_name);
        sr=findViewById(R.id.from_id);
        dest=findViewById(R.id.to_id);
        doj=findViewById(R.id.journey_date);
        adh_no=findViewById(R.id.aadhaar);
        mob_no=findViewById(R.id.mobile);

        Calendar calendar=Calendar.getInstance();
        d= calendar.get(Calendar.DAY_OF_MONTH);
        m=calendar.get(Calendar.MONTH);
        y=calendar.get(Calendar.YEAR);

        doj.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                new DatePickerDialog(GenerateQR.this,listener,y,m,d).show();
            }
        });

        sc_fg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                name=name_o_p.getText().toString();
                trainname=tr_name.getText().toString();
                trainno=tr_no.getText().toString();
                state=st.getText().toString();
                city=ct.getText().toString();
                source=sr.getText().toString();
                destination=dest.getText().toString();
                date=doj.getText().toString();
                aadhaar=adh_no.getText().toString();
                mobile=mob_no.getText().toString();

                if(name.isEmpty()||trainname.isEmpty()||trainno.isEmpty()||state.isEmpty()||city.isEmpty()
                        ||source.isEmpty()||destination.isEmpty()||date.isEmpty()||aadhaar.isEmpty()||mobile.isEmpty()){
                    Toast.makeText(GenerateQR.this, "Please fill all the Details!", Toast.LENGTH_SHORT).show();
                }
                else {
                    Passenger passenger = new Passenger();

                    int random = new Random().nextInt(100000000) + 999999999;
                    String pnr = String.valueOf(random).trim();
                    passenger.setPnr(pnr);
                    passenger.setName(name);
                    passenger.setTrainname(trainname);
                    passenger.setTrainno(trainno);
                    passenger.setState(state);
                    passenger.setCity(city);
                    passenger.setSource(source);
                    passenger.setDestination(destination);
                    passenger.setDate(date);
                    passenger.setAadhaar(aadhaar);
                    passenger.setMobile(mobile);


                    Intent i = new Intent(GenerateQR.this, ScanFingerprint.class);
                    i.putExtra("passenger", passenger);
                    startActivity(i);
                    finish();
                }

            }
        });



    }

    DatePickerDialog.OnDateSetListener listener=new DatePickerDialog.OnDateSetListener() {
        @Override
        public void onDateSet(DatePicker datePicker, int i, int i1, int i2) {
            doj.setText(i2+"/"+(i1+1)+"/"+i);
            d=i2;
            m=i1;
            y=i;
        }
    };
}
