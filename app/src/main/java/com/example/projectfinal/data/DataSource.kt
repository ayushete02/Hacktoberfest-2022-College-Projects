package com.example.projectfinal.data

import com.example.projectfinal.R
import com.example.projectfinal.model.TimeSequence

class DataSource() {
    fun loadTimeSequence(): List<TimeSequence> {
        return listOf<TimeSequence>(
            TimeSequence(R.string.os,R.string.os_teacher,R.drawable.understanding_os),
            TimeSequence(R.string.algorithm,R.string.algorithm_teacher,R.drawable.algorithms),
            TimeSequence(R.string.data_structures,R.string.data_teacher,R.drawable.data_structures),
            TimeSequence(R.string.discrete_maths,R.string.maths_teacher,R.drawable.discrete_mathematics),
            TimeSequence(R.string.microprocessor,R.string.micro_teacher,R.drawable.microprocessors),
            TimeSequence(R.string.neural_network,R.string.neural_teacher,R.drawable.neural_network),
        )
    }
}