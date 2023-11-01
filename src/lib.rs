// Импорт пакета
// https://doc.rust-lang.org/beta/reference/names/preludes.html
// https://stackoverflow.com/questions/36384840/what-is-the-prelude
use wasm_bindgen::prelude::*;

// Импорт функции `window.alert` из "Веба"
#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

// Экспорт функции `greet` в JavaScript
#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}