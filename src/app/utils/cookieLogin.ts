import Cookies from 'js-cookie';

export interface UserCookie {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

// เก็บข้อมูล
export const setLoginCookie = (data: UserCookie) => {
  Cookies.set("username", data.username);
  Cookies.set("first_name", data.first_name);
  Cookies.set("last_name", data.last_name);
  Cookies.set("email", data.email);
};

// ดึงข้อมูล
export const getLoginCookie = (): UserCookie => {
  return {
    username: Cookies.get("username") || "",
    first_name: Cookies.get("first_name") || "",
    last_name: Cookies.get("last_name") || "",
    email: Cookies.get("email") || "",
  };
};

// ลบ cookie
export const clearLoginCookie = () => {
  Cookies.remove("username");
  Cookies.remove("first_name");
  Cookies.remove("last_name");
  Cookies.remove("email");
};