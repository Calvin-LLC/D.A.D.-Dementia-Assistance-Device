import React, { useRef, useState, useEffect } from "react"; // standard react to edit elements etc
import axios from "axios"; // ezpz web comm

var data_storage;
var correct_email;
var correct_password;
var login_url = "https://ziadabdelati.com/check.php?type=";
var current_screen;

const http_get = (URL) => {
  return axios({
    url: URL,
  }).then((response) => {
    return response.data;
  });
};

const http_post = (URL, DATA) => {
  return axios({
    method: 'post',
    url: URL,
    data: DATA
  }).then((response) => {
      return response.data;
  });
}

const save_login = (email, pass) => {
  correct_email = email;
  correct_password = pass;
};

const data_recieve = () => {
  var recieve_url = login_url + "data_recieve" + "&email=" + correct_email + "&pword=" + correct_password;
  return http_get(recieve_url).then((response) => {
    return response;
  });
};

const data_send = (data) => {
    var send_url = login_url + "data_send" + "&email=" + correct_email + "&pword=" + correct_password + "&data=" + data;
    http_get(send_url).then((response) => {
        console.log(response);
    });
};

const get_reminder_data = () => {
  var url = login_url + "get_reminder_data" + "&email=" + correct_email + "&pword=" + correct_password;
  return http_get(url).then((response) => {
    return response.data;
  });
}


var obj = {
  "data":[
    {"date":"reminder"},
    {"date2":"reminder2"}
  ]
};

var new_obj = {
  "date":"reminder"
};

const send_reminder_data = (new_data) => {
  get_reminder_data().then((response) => {
    var send_data = response.data;
    send_data.push(new_data);
    
    var url = login_url + "send_reminder_data" + "&email=" + correct_email + "&pword=" + correct_password;
    http_post(url, send_data).then((res) => {
      console.log(res);
    });
  });
}

const save_screen = (current) => {
  current_screen = current;
}

const get_current_screen = () => {
  return current_screen;
}

export default {data_recieve, save_screen, http_get, http_post};
export {data_recieve, save_login, data_send, save_screen, get_current_screen, http_get, get_reminder_data, send_reminder_data};