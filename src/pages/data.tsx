import React, { useRef, useState, useEffect } from "react"; // standard react to edit elements etc
import axios from "axios"; // ezpz web comm

var data_storage: string;
var correct_email: string;
var correct_password: string;
var login_url = "https://ziadabdelati.com/check.php?type=";

export const http_get = (URL: string) => {
  return axios({
    url: URL,
  }).then((response) => {
    console.log(response);
    return response.data;
  });
};

export const save_login = (email: any, pass: any) => {
  correct_email = email;
  correct_password = pass;
};

export const data_recieve = () => {
    var recieve_url = login_url + "data_recieve" + "&email=" + correct_email + "&pword=" + correct_password;
    http_get(recieve_url).then((response: any) => {
        console.log(response);
    });
};

export const data_send = () => {};
