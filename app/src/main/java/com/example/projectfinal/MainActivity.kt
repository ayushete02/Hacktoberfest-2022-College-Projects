package com.example.projectfinal

import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.R
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.BasicText
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Alignment.Companion.CenterHorizontally
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.projectfinal.data.DataHomeSource
import com.example.projectfinal.data.DataSource
import com.example.projectfinal.model.HomeSequence
import com.example.projectfinal.model.TimeSequence
import com.example.projectfinal.ui.theme.ProjectFinalTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ProjectFinalTheme {
                val navController = rememberNavController()
                Scaffold(
                    bottomBar = {
                        BottomNavigationBar(
                            items = listOf(BottomNavItem(
                                name = "Home" ,
                                route = "Home",
                                icon = Icons.Default.Home),
                                BottomNavItem(
                                    name = "Textbook",
                                            route = "Timetable",
                                            icon =  Icons.Default.List
                                    ),
                                    BottomNavItem(
                                    name = "ToDo",
                                            route = "Todo",
                                            icon = Icons.Default.Add),
                                    BottomNavItem(
                                    name = "Notifications",
                                            route = "Notifications",
                                            icon = Icons.Default.Notifications)), navController = navController, onItemClick = {
                                                navController.navigate(it.route)
                                } )
                    }
                ){

                    Navigation(navController = navController)
                }
            }
        }
    }
}

@Composable
fun Navigation(navController: NavHostController) {
    NavHost(navController = navController,startDestination = "Home"){
        composable(route = "Home"){
            HomeScreen()
        }
        composable(route = "Timetable"){
            TimetableScreen()
        }
        composable(route = "Todo"){
            ToDoScreen()
        }
        composable(route = "Notifications"){
            NotifScreen()
        }
    }
}

@Composable
fun BottomNavigationBar(
    items: List<BottomNavItem>,
    navController: NavHostController,
    modifier: Modifier = Modifier,
    onItemClick: (BottomNavItem) -> Unit
){
    val backStackEntry = navController.currentBackStackEntryAsState()
    BottomNavigation (
        modifier = modifier,
        backgroundColor = Color.White,
        elevation = 5.dp
            ){
        items.forEach { item ->
            val selected = item.route == backStackEntry.value?.destination?.route
            BottomNavigationItem(selected = selected, onClick = { onItemClick(item) },
                selectedContentColor = Color.Cyan,
                unselectedContentColor = Color.Gray,
                icon = {
                    Column(horizontalAlignment = CenterHorizontally){
                        if (item.badgeCount > 0) {
                            BadgedBox(badge = { Badge { Text(text = item.badgeCount.toString()) } }) {
                                Icon(imageVector = item.icon, contentDescription = item.name)
                            }

                        }
                        else{
                            Icon(imageVector = item.icon, contentDescription = item.name)
                        }
                        if (selected){
                            Text(text = item.name,
                            textAlign = TextAlign.Center,
                            fontSize = 10.sp)
                        }
                    }

                })
        }
    }
}


@Composable
fun HomeScreen() {
    HomeDetails(homedetails = DataHomeSource().loadDataSequence())
}

@Composable
fun HomeDetails(homedetails : HomeSequence,modifier:Modifier = Modifier)
{
    Column(modifier = Modifier
        .fillMaxHeight()
        .fillMaxWidth()
        .background(color = Color(0xff150050)),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Image(
            painter = painterResource(homedetails.imageResourceIdProf),
            contentDescription = null,
            modifier = Modifier
                .height(200.dp)
                .width(200.dp),
        )
        Text(
            text = stringResource(homedetails.stringResourceIdName),
            fontSize = 36.sp,
            color = Color.White
        )
        Text(text = stringResource(homedetails.stringResourceIdReg), color = Color.White, fontSize = 20.sp)
        Text(text = stringResource(homedetails.stringResourceIdBatch), color = Color.White, fontSize = 20.sp)
    }
}
@Composable
fun TimetableCard(timetable : TimeSequence,modifier:Modifier = Modifier) {
    Card(modifier = modifier.padding(8.dp), elevation = 4.dp) {
        Column {
            Image(
                painter = painterResource(timetable.imageResourceId),
                contentDescription = stringResource(timetable.stringResourceId),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(194.dp),
                contentScale = ContentScale.Crop
            )
            Column() {
                Text(
                    text = stringResource(timetable.stringResourceId),
                    modifier = Modifier.padding(16.dp),
                    style = MaterialTheme.typography.h6
                )
                Text(
                    text = stringResource(timetable.stringResourceIdTcr),
                    modifier = Modifier.padding(5.dp),
                    style = MaterialTheme.typography.h6)
            }

        }
    }
}
@Composable
fun TimetableList(timetableList: List<TimeSequence>, modifier: Modifier = Modifier) {
    LazyColumn {
        items(timetableList) { timetable -> TimetableCard(timetable) }
    }

    }

@Composable
fun TimetableScreen() {
    Scaffold(
        content = {
            TimetableList(timetableList = DataSource().loadTimeSequence())
        }
    )
}


@Composable
fun ToDoScreen() {
    Column(modifier = Modifier .fillMaxHeight()
        .fillMaxWidth() .background(color = Color(0xff150050))){
        Text(text = "TO DO LIST",color = Color.White, fontSize = 40.sp, fontFamily = FontFamily.Serif)
        GroupedCheckbox(
            mItemsList = listOf(
                "Operating Systems Assignment 1",
                "Machine Learning Quiz",
                "Microprocessor Record Submission"
            )
        )
    }

}

@Composable
fun NotifScreen() {
    ScreenDemo()
}

@Composable
fun GroupedCheckbox(mItemsList: List<String>) {

    mItemsList.forEach { items ->
        Row(modifier = Modifier.padding(16.dp)) {
            val isChecked = remember { mutableStateOf(false) }

            Checkbox(
                checked = isChecked.value,
                onCheckedChange = { isChecked.value = it },
                enabled = true,
                colors = CheckboxDefaults.colors(
                    checkedColor = Color.Cyan,
                    uncheckedColor = Color.DarkGray,
                    checkmarkColor = Color.White
                )
            )
            Text(text = items,color = Color.White, fontSize = 15.sp,modifier = Modifier.padding(16.dp))
        }
    }
}

@Composable
fun ScreenDemo(model: MainActivityViewModel = viewModel()) {
    val count by model.counterLiveData.observeAsState(0)
    var counter: Int = ((count + 1) % 3)
    Column(horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center, modifier = Modifier.padding(top = 200.dp) .fillMaxHeight()
            .fillMaxWidth() .background(color = Color(0xff150050)) ) {
        if (counter == 0) {
            Text(
                stringResource(com.example.projectfinal.R.string.blurb_one), fontSize = 32.sp,
                color = Color.White, fontFamily = FontFamily.Serif,textAlign = TextAlign.Center
            )
        } else if (counter == 1) {
            Text(
                stringResource(com.example.projectfinal.R.string.blurb_two), fontSize = 32.sp,
                color = Color.White,fontFamily = FontFamily.Serif,textAlign = TextAlign.Center
            )
        } else if (counter == 2) {
            Text(
                stringResource(com.example.projectfinal.R.string.blurb_three), fontSize = 32.sp,
                color = Color.White,fontFamily = FontFamily.Serif,textAlign = TextAlign.Center
            )
        }
    }
    Demo("") { model.increaseCounter() }
}
@Composable
fun Demo(text: String, onClick: () -> Unit = {}) {
    Column( ) {
        BasicText(text)
        Button(
            onClick = onClick,
        ) {
            Text(text = "View Next Notification",color = Color.White)
        }
    }
}

