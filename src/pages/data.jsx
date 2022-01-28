import axios from "axios"; // ezpz web comm

var login_url = "https://ziadabdelati.com/check.php";
var is_logged_in = {"toggle":false};
var template = {
  "email" : "",
  "pword" : "",
  "type"  : "",
  "post"  : ""
};

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

const save_login = (obj) => {
  template.email = obj.email;
  template.pword = obj.pword;
};

const data_recieve = () => {
  var new_obj = template;
  new_obj.type = "data_recieve";
  return http_post(login_url, new_obj).then((response) => {
    return response;
  });
};

const data_send = (data) => {
    var new_obj = template;
    new_obj.type = "data_send";
    new_obj.post = data;
    http_post(login_url, new_obj).then((response) => {
      //console.log(response);
    });
};

const get_reminder_data = () => {
  var new_obj = template;
  new_obj.type = "get_reminder_data";
  return http_post(login_url, new_obj).then((response) => {
    return response.data;
  });
}

const send_reminder_data = (new_data) => {
  return get_reminder_data().then((response) => {
    var send_data = response.data;
    send_data.push(new_data);
    
    var new_obj = template;
    new_obj.type = "send_reminder_data";
    new_obj.post = send_data;
    return http_post(login_url, new_obj).then((res) => {
      return res;
    });
  });
}

const send_reminder_contact = (contact) => {
  var new_obj = template;
  new_obj.type = "send_reminder_contact";
  new_obj.post = contact;
  return http_post(login_url, new_obj).then((res) => {
    return res;
  });
}

export default {data_recieve, http_get, http_post, is_logged_in, send_reminder_data, send_reminder_contact};
export {data_recieve, save_login, data_send, http_get, http_post, get_reminder_data, send_reminder_data, send_reminder_contact, is_logged_in};