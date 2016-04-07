/**
 * Created by lmmeng on 2015-10-19.
 * ԤԼģ��
 */

'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var reserveSchema = new Schema({
    type: String,// store:预约到点, visit:上门量体, activity:活动预约
    userName: {type: String, default: '匿名用户'},
    birthday: Date,
    weddingDate: Date,
    height: Number,
    weight: Number,
    area: String,
    phoneNumber: String,
    appointmentTime: Date,
    channel: String,
    remark: String,
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
});
var reserveScheduleSchema = new Schema({
    startTime: Date, // 开始时间，日期忽略
    endTime: Date, //结束时间，日期忽略
    timeRange: Number, // 间隔时间段
    customer: Number, // 接待人数
    create_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
});
mongoose.model('Reserve', reserveSchema);
mongoose.model('ReserveSchema', reserveScheduleSchema);
