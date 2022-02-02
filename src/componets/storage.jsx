import { Storage, Drivers } from "@ionic/storage";

var storage = false;

export const db_init = (name = "thesis_db") => {
    storage = new Storage({name, driverOrder:[Drivers.IndexedDB, Drivers.LocalStorage]});
    storage.create();
}

export const db_set = (id, value) => {
    storage.set(id, value);
}

export const db_get = async id => {
    const ret_val = await storage.get(id);
    return ret_val;
}

export const db_delete = async id => {
    await storage.remove(id);
}

export const db_set_obj = async (id, index, value) => {
    const all = await storage.get(index);
    const objIndex = await all.findIndex(a => parseInt(a.id) === parseInt(index));

    all[objIndex] = value;
    db_set(id, all);
}

export const db_remove_obj = async (id, index) => {
    const all = await storage.get(id);
    const objIndex = await all.findIndex(a => parseInt(a.id) === parseInt(index));

    all.splice(objIndex, 1);
    db_set(id, all);
}

export const db_get_obj = async (id, index) => {
    const all = await db_get(id);
    const obj = await all.filter(a => parseInt(a.id) === parseInt(index))[0];
    return obj;
}