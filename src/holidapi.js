const axios = require('axios').default;

const http = axios.create({
  baseURL: process.env.HOLIDAPI_BASE_URL,
  timeout: 1000
});

holidapi = {
  list_countries: async () => {
    const res = await http.get('/countries');

    console.log(res.data.data);
  },
  list_holidays: async (country, date_range) => {
    try {
      const res = await
        http.get(
          `/holidays/${country}`,
          {
            params: {
              start: date_range.start,
              end: date_range.end
            }
          }
        );

      return res;
    } catch (e) {
      throw e;
    }
  },
  is_valid_holiday: async function (country, date, holiday_id) {
    try {
      const res = await this.list_holidays(country, {start: date, end: date});
      const valid_holiday = res.data.data.filter((el) => el.uid == holiday_id);

      return valid_holiday.length > 0;
    } catch (e) {
      throw e;
    }
  }
};

module.exports = holidapi;
