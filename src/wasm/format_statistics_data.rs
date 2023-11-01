use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use serde_json::{json};

pub fn format_statistics_data(marks: JsValue) -> JsValue {
    // Десериализация JsValue в serde_json::Value
    let marks: serde_json::Value = serde_wasm_bindgen::from_value(marks).unwrap();

    // Получение всех оценок из JSON-структуры
    let all_marks = marks["daysWithMarksForSubject"]
        .as_array()
        .unwrap()
        .iter()
        .flat_map(|subject| {
            if let Some(arr) = subject["daysWithMarks"].as_array() {
                arr.iter()
            } else {
                [].iter() // Возвращение пустого итератора по умолчанию
            }
        })
        .flat_map(|day| {
            if let Some(arr) = day["markValues"].as_array() {
                arr.iter()
            } else {
                [].iter() // Возвращение пустого итератора по умолчанию
            }
        })
        .filter_map(|value| value.as_str()) // Фильтрация значений, не являющихся строками
        .collect::<Vec<&str>>(); // Сбор фактических строковых значений оценок

    // Вычисление общего количества оценок
    let total_number_of_marks = all_marks.len() as u32;

    // Вычисление общей суммы оценок
    let total_sum_of_marks: u32 = all_marks.iter()
        .map(|&mark| match mark {
            "Five" => 5,
            "Four" => 4,
            "Three" => 3,
            "Two" => 2,
            _ => 0,
        })
        .sum();

    // Вычисление средней оценки
    let average_mark = total_sum_of_marks as f64 / total_number_of_marks as f64;

    // Создание HashMap для подсчёта количества каждой оценки
    let mut mark_counts = HashMap::new();

    // Подсчёт количества каждой оценки в HashMap
    for mark in &all_marks {
        let count = mark_counts.entry(*mark).or_insert(0);
        *count += 1;
    }

    // Создание результирующего JSON-объекта
    let result = json!({
        "totalNumberOfMarks": total_number_of_marks,
        "averageMark": average_mark,
        "markCounts": mark_counts,
    });

    // Преобразование JSON-объекта в строку и создание JsValue из этой строки
    JsValue::from_str(&serde_json::to_string(&result).unwrap())
}
