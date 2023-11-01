pub fn is_today(day: u32, month: u32, year: u32) -> bool {
    let today = js_sys::Date::new_0();

    let today_day = today.get_date();
    let today_month = today.get_month();
    let today_year = today.get_full_year();

    today_day == day && today_month == month && today_year == year
}
