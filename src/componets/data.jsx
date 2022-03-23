import axios from "axios"; // ezpz web comm
import { db_get, db_set } from "./storage";

var login_url = "https://ziadabdelati.com/check.php";
var template = {
  email: "",
  pword: "",
  type: "",
  post: "",
};

export const http_get = (URL) => {
  return axios({
    url: URL,
  }).then((response) => {
    return response.data;
  });
};

export const http_post = (URL, DATA) => {
  return axios({
    method: "post",
    url: URL,
    data: DATA,
  }).then((response) => {
    return response.data;
  });
};

// saves the login in order for future use in the data lib
export const save_login = (obj) => {
  template.email = obj.email;
  template.pword = obj.pword;
};

// returns a promise containing all the data from the server
export const data_recieve = () => {
  var new_obj = template;
  new_obj.type = "data_recieve";
  return http_post(login_url, new_obj).then((response) => {
    //console.log(response);
    return response;
  });
};

// sends whatever data to the server
export const data_send = (data) => {
  var new_obj = template;
  new_obj.type = "data_send";
  new_obj.post = data;
  http_post(login_url, new_obj).then((response) => {
    //console.log(response);
  });
};

// add bonus time to the kitchen timer
export const bonus_time_add = async (bonus) => {
  var data_from_server = await data_recieve();

  if (!data_from_server.data) return;

  var new_obj = template;
  new_obj.type = "data_send";

  var post_obj = data_from_server;

  try {
    post_obj["time"]["bonus"] += bonus.bonus;
  } catch (e) {
    post_obj["time"].push(bonus);
  }

  new_obj.post = JSON.stringify(post_obj);
  return http_post(login_url, new_obj).then((response) => {
    return new_obj.post;
  });
};

// add barcode data
export const barcode_add = async (barcode) => {
  var data_from_server = await data_recieve();

  if (!data_from_server.data) return;

  var new_obj = template;
  new_obj.type = "data_send";

  var post_obj = data_from_server;

  try {
    post_obj["data"]["pill"].append(barcode);
  } catch (e) {
    post_obj["data"].push({ type: "pill", barcode });
  }

  new_obj.post = JSON.stringify(post_obj);
  return http_post(login_url, new_obj).then((response) => {
    return new_obj.post;
  });
};

// add data to the server
export const wander_data_add = async (data) => {
  const data_from_server = await data_recieve();

  if (!data_from_server.data) return;

  var new_obj = template;
  new_obj.type = "data_send";

  var post_obj = data_from_server;

  // new P way to set data, by using errors!!!!!
  try {
    post_obj["wander_start"] = data.wander_start;
    post_obj["wander_end"] = data.wander_end;
  } catch (error) {
    post_obj["data"].push(data);
  }

  new_obj.post = JSON.stringify(post_obj);
  return http_post(login_url, new_obj).then((response) => {
    return response;
  });
};

// add kitchen data to the server
export const kitchen_data_add = async (data) => {
  const data_from_server = await data_recieve();

  if (!data_from_server.data) return;

  var new_obj = template;
  new_obj.type = "data_send";

  var post_obj = data_from_server;

  // new P way to set data, by using errors!!!!!
  try {
    post_obj["time"] = data;
  } catch (error) {
    post_obj["data"].push({ time: JSON.stringify(data) });
  }

  new_obj.post = JSON.stringify(post_obj);
  return http_post(login_url, new_obj).then((response) => {
    return response;
  });
};

// returns a promise of reminder data
export const get_reminder_data = () => {
  var new_obj = template;
  new_obj.type = "get_reminder_data";
  return http_post(login_url, new_obj).then((response) => {
    return response;
  });
};

// sets notification type
export const set_notification = async (data) => {
  var new_obj = template;
  new_obj.type = "send_reminder_data";

  var post_obj = await get_reminder_data();
  try {
    post_obj["data"]["reminder_type"] = data;
  } catch(e) {
    post_obj["data"].push({reminder_type: data});
  }
  new_obj.post = JSON.stringify(post_obj);

  return http_post(login_url, new_obj).then((res) => {
    return res;
  });
}

// get facial recognition data with pictures, stores the images aswell to decrease loading times
export const get_recognition_data = async () => {
  var new_obj = template;
  new_obj.type = "get_recognition_data";
  
  var response = await http_post(login_url, new_obj);
  db_set("recognition_data", response);
};

// add facial recognition data
export const add_facial_recognition_data = async (data) => {
  var new_obj = template;
  new_obj.type = "add_recognition_data";

  var cached_data = db_get("recognition_data");
  if (!cached_data) {
    await get_recognition_data();
    cached_data = db_get("recognition_data");
  }

  var post_obj = cached_data;

  try {
    post_obj["data"].append(data);
  } catch (e) {
    post_obj = { data: [data] };
  }

  new_obj.post = JSON.stringify(post_obj);

  return http_post(login_url, new_obj).then((response) => {
    console.log(response);
  })
};

// automatically retrieves reminder data, adds the new data, then sends new one to server
export const send_reminder_data = (new_data) => {
  return get_reminder_data().then((response) => {
    var new_obj = template;
    new_obj.type = "send_reminder_data";
    if (response.length == 0) {
      new_obj.post = JSON.stringify({
        data: [new_data],
        success: 1,
      });
    } else {
      var post_obj = response;
      post_obj["data"].push(new_data);
      new_obj.post = JSON.stringify(post_obj);
    }

    return http_post(login_url, new_obj).then((res) => {
      return res;
    });
  });
};

// remove the reminder data at i index
export const remove_reminder_data = (i) => {
  return get_reminder_data().then((response) => {
    var new_obj = template;
    new_obj.type = "send_reminder_data";
    var post_obj = response;
    post_obj.data.splice(i, 1);
    new_obj.post = JSON.stringify(post_obj);

    return http_post(login_url, new_obj).then((res) => {
      return res;
    });
  });
};

// contact as a string, either email or phone number
export const send_reminder_contact = (contact, carrier, type) => {
  return get_reminder_contact().then((response) => {
    var new_obj = template;
    new_obj.type = "send_reminder_contact";
    //new_obj.post = '{"data":[{"contact":"' + contact + '"}],"success":1}';
    if (response.length == 0) {
      new_obj.post = {
        data: [{ contact: contact, carrier: carrier, type: type }],
        success: 1,
      };
    } else {
      var post_obj = response;
      post_obj["data"].push({ contact: contact, carrier: carrier, type: type });
      new_obj.post = JSON.stringify(post_obj);
    }

    return http_post(login_url, new_obj).then((res) => {
      return res;
    });
  });
};

// removes whatever contact i send it
export const remove_reminder_contact = (i) => {
  return get_reminder_contact().then((response) => {
    var new_obj = template;
    new_obj.type = "send_reminder_contact";
    var post_obj = response;
    post_obj.data.splice(i, 1);
    new_obj.post = JSON.stringify(post_obj);

    return http_post(login_url, new_obj).then((res) => {
      return res;
    });
  });
};

// returns a promise containing the json of the reminder details
export const get_reminder_contact = () => {
  var new_obj = template;
  new_obj.type = "get_reminder_contact";
  return http_post(login_url, new_obj).then((response) => {
    return response;
  });
};

// geolocation -> json
export const to_object = (obj) => {
  if (obj === null || !(obj instanceof Object)) return obj;
  var temp = obj instanceof Array ? [] : {};
  for (var key in obj) temp[key] = to_object(obj[key]);
  return temp;
};

// sends location object to the server
export const send_geolocation = (location, set_home_location) => {
  return get_geolocation().then((response) => {
    var new_obj = template;
    new_obj.type = "send_geolocation";
    //new_obj.post = '{"data":[{"contact":"' + contact + '"}],"success":1}';
    if (response.length == 0) {
      var post_obj = { home: location.coords, current: location.coords };
      new_obj.post = JSON.stringify(post_obj);
    } else if (set_home_location == false) {
      var post_obj = response;
      post_obj.current = location.coords;
      new_obj.post = JSON.stringify(post_obj);
    } else if (set_home_location == true) {
      var post_obj = response;
      post_obj.current = location.coords;
      post_obj.home = location.coords;
      new_obj.post = JSON.stringify(post_obj);
    }
    return http_post(login_url, new_obj).then((res) => {
      return res;
    });
  });
};

// get the geolocation object from the server
export const get_geolocation = () => {
  var new_obj = template;
  new_obj.type = "get_geolocation";
  return http_post(login_url, new_obj).then((response) => {
    return response;
  });
};

// sends a base64 representation of an image to the server to be processed and saved
export const send_picture = (picture) => {
  var new_obj = template;
  new_obj.type = "picture";
  new_obj["post"] = picture;
  return http_post(login_url, new_obj).then((response) => {
    return response;
  });
};
