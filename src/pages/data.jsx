import React, { useRef, useState, useEffect } from "react"; // standard react to edit elements etc
import axios from "axios"; // ezpz web comm

var data_storage;
var correct_email;
var correct_password;
var login_url = "https://ziadabdelati.com/check.php?type=";

export const http_get = (URL) => {
  return axios({
    url: URL,
  }).then((response) => {
    console.log(response);
    return response.data;
  });
};

export const save_login = (email, pass) => {
  correct_email = email;
  correct_password = pass;
};

export const data_recieve = () => {
    var recieve_url = login_url + "data_recieve" + "&email=" + correct_email + "&pword=" + correct_password;
    http_get(recieve_url).then((response) => {
        return JSON.parse(response.data);
    });
};

export const data_send = (data) => {
    var send_url = login_url + "data_send" + "&email=" + correct_email + "&pword=" + correct_password + "&data=" + data;
    http_get(send_url).then((response) => {
        console.log(response);
    });
};
