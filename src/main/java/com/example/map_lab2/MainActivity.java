package com.example.map_lab2;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.app.DatePickerDialog;
import android.app.ListActivity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.SparseBooleanArray;
import android.view.View;
import android.widget.Adapter;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Calendar;

public class MainActivity extends AppCompatActivity {
    EditText dobIp, editText, agecal;
    CheckBox c1;
    Button s1;
    ListView l1;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // SCROLL SELECT LIST
        String[] intrests;
        l1 = (ListView) findViewById(R.id.l1);
        intrests = getResources().getStringArray(R.array.intrests);
        ArrayAdapter<String> adapter1 = new ArrayAdapter<String>(this, android.R.layout.select_dialog_multichoice, intrests);
        l1.setAdapter(adapter1);
        l1.setChoiceMode(2);

        // FREQUENCY SCROLL LIST
        String[] freq;
        freq = getResources().getStringArray(R.array.Freq);
        Spinner sp1 = (Spinner) findViewById(R.id.spinner1);
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, freq);
        sp1.setAdapter(adapter);


        // SUBMIT CHECKBOX
        c1 = (CheckBox) findViewById(R.id.boxcheck);
        s1 = (Button) findViewById(R.id.s1);
        c1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                    s1.setVisibility(view.VISIBLE);
                    s1.setEnabled(true);

            }
        });

        EditText dobenter = (EditText) findViewById(R.id.textviewdob);
        EditText ageenter = (EditText) findViewById(R.id.editage);

        dobenter.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.N)
            @Override
            public void onClick(View v) {
                final Calendar c = Calendar.getInstance();
                int year = c.get(Calendar.YEAR);
                int month = c.get(Calendar.MONTH);
                int date = c.get(Calendar.DATE);

                DatePickerDialog datePickerDialog = new DatePickerDialog(MainActivity.this, new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(DatePicker view, int year, int monthofYear, int dayOfMonth) {
                        dobenter.setText(dayOfMonth + "-" + (monthofYear + 1) + "-" + year);
                        ageenter.setText(String.valueOf(c.get(Calendar.YEAR) - year));
                    }
                }, year, month, date);

                datePickerDialog.show();
            }
        });

        EditText text1 = findViewById(R.id.entername);
        EditText text2 = findViewById(R.id.entereid);
        EditText text3 = findViewById(R.id.entermob);
        EditText text4 = findViewById(R.id.textviewdob);
        EditText text5 = findViewById(R.id.editage);
        RadioGroup radio6 = findViewById(R.id.rgrp);

        s1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String val1 = text1.getText().toString();
                String val2 = text2.getText().toString();
                String val3 = text3.getText().toString();
                String val4 = text4.getText().toString();
                String val5 = text5.getText().toString();
                String val6 = "";

                if (radio6.getCheckedRadioButtonId() == -1) {
                } else {
                    int selectedId = radio6.getCheckedRadioButtonId();
                    RadioButton sbutton = (RadioButton) findViewById(selectedId);
                    val6 = sbutton.getText().toString();
                }

                String val7 = String.valueOf(sp1.getSelectedItem());
                String val8 = String.valueOf(l1.getSelectedItem());

                if (val1 != "" && val2 != "" && val3 != "" && val6 != "" && val7 != "" && val8 != "") {
                    Bundle b = new Bundle();
                    b.putString("Username", "Username : " + val1);
                    b.putString("Email", "Email : " + val2);
                    b.putString("Mobile_no", "Mobile No : " + val3);
                    b.putString("DOB", "DOB : " + val4);
                    b.putString("AGE", "AGE : " + val5);
                    b.putString("Gender", "Gender : " + val6);
                    b.putString("Frequency", "Frequency : " + val7);

                    SparseBooleanArray checked  = l1.getCheckedItemPositions();
                    ArrayList<String> selected = new ArrayList<String>();

                    for (int x = 0; x < checked.size(); x++) {
                        int checkedbox = checked.keyAt(x);
                        if (checked.valueAt(x)) {
                            selected.add(adapter1.getItem(checkedbox));
                        }
                    }
                    String[] listarr = new String[selected.size()];
                    for (int x = 0; x < selected.size(); x++) {
                        listarr[x] = selected.get(x);
                    }

                    Intent i = new Intent(MainActivity.this, com.example.map_lab2.MainActivity2.class);
                    b.putStringArray("Interests : " , listarr);
                    i.putExtras(b);
                    startActivity(i);

                    Toast.makeText(MainActivity.this, "SUBMIT SUCCESSFULLY", Toast.LENGTH_SHORT).show();

                }
                else{
                    Toast.makeText(MainActivity.this, "Please fill all the required fields.", Toast.LENGTH_SHORT).show();
                }

            }

        });
    }
}