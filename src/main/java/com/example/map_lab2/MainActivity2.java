package com.example.map_lab2;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

public class MainActivity2 extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        ListView lst; //LIST VIEW FOR INTRESTS
        Bundle b = getIntent().getExtras();
        if (b != null){
            String val1 = b.getString("Username");
            String val2 = b.getString("Email");
            String val3 = b.getString("Mobile_no");
            String val4 = b.getString("DOB");
            String val5 = b.getString("AGE");
            String val6 = b.getString("Gender");
            String val7 = b.getString("Frequency");
            String[] val8 = b.getStringArray("Interests : ");
            ListView listView8 = findViewById(R.id.textview8);

                // MAKE ADAPTER FOR LISTVIEW
            ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1,val8);
            listView8.setAdapter(adapter);

            TextView textView1 = findViewById(R.id.textview1);
            TextView textView2 = findViewById(R.id.textview2);
            TextView textView3 = findViewById(R.id.textview3);
            TextView textView4 = findViewById(R.id.textview4);
            TextView textView5 = findViewById(R.id.textview5);
            TextView textView6 = findViewById(R.id.textview6);
            TextView textView7 = findViewById(R.id.textview7);


            textView1.setText(val1);
            textView2.setText(val2);
            textView3.setText(val3);
            textView4.setText(val4);
            textView5.setText(val5);
            textView6.setText(val6);
            textView7.setText(val7);



        }
    }
}