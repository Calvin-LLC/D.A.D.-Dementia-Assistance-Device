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
    return response;
  });
}

const send_reminder_data = (new_data) => {
  return get_reminder_data().then((response) => {
    var new_obj = template;
    new_obj.type = "send_reminder_data";
    if (response.length == 0) {
      new_obj.post = '{"data":[{"date":"' + new_data.date + ', "reminder" : ' + new_data.reminder + '"}],"success":1}';
    } else {
      var post_obj = response;
      post_obj["data"].push({"date" : new_data.date, "reminder" : new_data.reminder});
      new_obj.post = JSON.stringify(post_obj);
      console.log(new_obj);
    }

    return http_post(login_url, new_obj).then((res) => {
      return res;
    });
  });
}

const send_reminder_contact = (contact) => {
  return get_reminder_contact().then((response) => {
    var new_obj = template;
    new_obj.type = "send_reminder_contact";
    new_obj.post = '{"data":[{"contact":"' + contact + '"}],"success":1}';
    if (response.length == 0) {
      new_obj.post = '{"data":[{"contact":"' + contact + '"}],"success":1}';
    } else {
      var post_obj = response;
      post_obj["data"].push({"contact" : contact });
      new_obj.post = JSON.stringify(post_obj);
      console.log(new_obj);
    }
    
    return http_post(login_url, new_obj).then((res) => {
      return res;
    });
  })
}

const get_reminder_contact = () => {
  var new_obj = template;
  new_obj.type = "get_reminder_contact";
  return http_post(login_url, new_obj).then((response) => {
    return response;
  });
};

export default {data_recieve, http_get, http_post, is_logged_in, send_reminder_data, send_reminder_contact, get_reminder_contact};
export {data_recieve, save_login, data_send, http_get, http_post, get_reminder_data, send_reminder_data, send_reminder_contact, get_reminder_contact, is_logged_in};