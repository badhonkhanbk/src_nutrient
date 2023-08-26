"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function organizeByDateAndType(challengePosts, type, today, endDate) {
    console.log('type', type);
    let returnData = [];
    if (type === 'W') {
        returnData = getWeeklyStats(challengePosts, today, endDate);
    }
    else if (type === 'M') {
        returnData = getMonthlyStats(challengePosts, today, endDate);
    }
    else if (type === 'Y') {
        returnData = getYearlyStats(challengePosts, today, endDate);
    }
    else if (type === 'YD') {
        returnData = getYearToDateStats(challengePosts, today, endDate);
    }
    return returnData;
}
exports.default = organizeByDateAndType;
/**
 * Generates weekly statistics based on challenge posts.
 *
 * @param {any[]} challengePosts - An array of challenge posts.
 * @param {Date} today - The current date.
 * @param {Date} endDate - The end date for the weekly statistics.
 * @return {any[]} An array of weekly statistics.
 */
function getWeeklyStats(challengePosts, today, endDate) {
    let tempDayString = endDate.toISOString().slice(0, 10);
    let returnData = [];
    for (let i = 0; i < 7; i++) {
        let tempDate = new Date(new Date(tempDayString).setDate(new Date(tempDayString).getDate() + i + 1));
        let index = challengePosts.findIndex((cp) => String(cp._id) == String(tempDate));
        if (index > -1) {
            returnData.push(challengePosts[index]);
        }
        else {
            returnData.push({
                _id: tempDate,
                consumptionInGram: 0,
            });
        }
    }
    return returnData;
}
/**
 * Retrieves the monthly statistics for challenge posts within a given time frame.
 *
 * @param {any[]} challengePosts - An array of challenge posts.
 * @param {Date} today - The current date.
 * @param {Date} endDate - The end date of the time frame.
 * @return {any[]} An array containing the monthly statistics for each day within the time frame.
 */
function getMonthlyStats(challengePosts, today, endDate) {
    let tempDayString = endDate.toISOString().slice(0, 10);
    let returnData = [];
    for (let i = 0; i < 30; i++) {
        let startDate = new Date(new Date(tempDayString).setDate(new Date(tempDayString).getDate() + i));
        let index = challengePosts.findIndex((cp) => cp._id.toString() == startDate.toString());
        if (index !== -1) {
            returnData.push(challengePosts[index]);
        }
        else {
            returnData.push({
                _id: startDate,
                consumptionInGram: 0,
            });
        }
    }
    return returnData;
}
/**
 * Calculates the yearly statistics based on the challenge posts.
 *
 * @param {any[]} challengePosts - The array of challenge posts.
 * @param {Date} today - The current date.
 * @param {Date} endDate - The end date of the statistics.
 * @return {any[]} An array of objects containing the statistics for each month.
 */
function getYearlyStats(challengePosts, today, endDate) {
    let returnData = [];
    for (let i = 0; i <= today.getMonth(); i++) {
        let firstDate = new Date();
        if (i + 1 < 10) {
            firstDate = new Date(new Date(`${today.getFullYear()}-0${i + 1}-01`)
                .toISOString()
                .slice(0, 10));
        }
        else {
            firstDate = new Date(new Date(`${today.getFullYear()}-${i + 1}-01`)
                .toISOString()
                .slice(0, 10));
        }
        let tempLastDay = getLastDate(today.getFullYear(), i);
        let lastDate = new Date();
        if (i + 1 < 10) {
            lastDate = new Date(new Date(`${today.getFullYear()}-0${i + 1}-${tempLastDay}`)
                .toISOString()
                .slice(0, 10));
        }
        else {
            lastDate = new Date(new Date(`${today.getFullYear()}-${i + 1}-${tempLastDay}`)
                .toISOString()
                .slice(0, 10));
        }
        let data = challengePosts.filter((cp) => cp._id >= firstDate && cp._id <= lastDate);
        let total = 0;
        if (data.length > 0) {
            data.forEach((d) => {
                total += d.consumptionInGram;
            });
            returnData.push({
                _id: firstDate,
                endDate: lastDate,
                consumptionInGram: total,
            });
        }
        else {
            returnData.push({
                _id: firstDate,
                endDate: lastDate,
                consumptionInGram: 0,
            });
        }
    }
    return returnData;
}
/**
 * Returns the last date of the month for the given year and month.
 *
 * @param {number} y - The year.
 * @param {number} m - The month (0-11).
 * @return {number} The last date of the month.
 */
function getLastDate(y, m) {
    return new Date(y, m + 1, 0).getDate();
}
/**
 * Generates year-to-date statistics based on challenge posts.
 *
 * @param {Array} challengePosts - An array of challenge post objects.
 * @param {Date} today - The current date.
 * @param {Date} endDate - The end date of the year.
 * @return {Array} An array of objects representing the year-to-date statistics.
 */
function getYearToDateStats(challengePosts, today, endDate) {
    let returnData = [];
    let firstDate = endDate;
    for (let i = 0; i < 12; i++) {
        let firstdayTempString = firstDate.toISOString().slice(0, 10);
        firstDate = new Date(new Date(firstdayTempString).setDate(new Date(firstdayTempString).getDate() + 1));
        let lastDate;
        if (i === 11) {
            lastDate = today;
        }
        else {
            lastDate = new Date(new Date(firstdayTempString).setDate(new Date(firstdayTempString).getDate() + 30));
        }
        let data = challengePosts.filter((cp) => cp._id >= firstDate && cp._id <= lastDate);
        let total = 0;
        if (data.length > 0) {
            data.forEach((d) => {
                total += d.consumptionInGram;
            });
            returnData.push({
                _id: firstDate,
                endDate: lastDate,
                consumptionInGram: total,
            });
        }
        else {
            returnData.push({
                _id: firstDate,
                endDate: lastDate,
                consumptionInGram: 0,
            });
        }
        firstDate = lastDate;
    }
    return returnData;
}
