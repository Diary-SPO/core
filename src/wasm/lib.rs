mod is_today;
mod format_statistics_data;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn is_today(day: u32, month: u32, year: u32) -> bool {
    is_today::is_today(day, month, year)
}

#[wasm_bindgen]
pub fn format_statistics_data(marks: JsValue) -> JsValue {
    format_statistics_data::format_statistics_data(marks)
}