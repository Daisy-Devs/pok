
export const validators = {
  name: (value: string) => {
    if (!value.trim()) return "Full name is required";
    return "";
  },

  email: (value: string) => {
    if (!value) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email format";
    return "";
  },

  phone: (value: string) => {
    if (!value) return "Phone number is required";
    if (!/^\d{10}$/.test(value)) return "Phone must be 10 digits";
    return "";
  },

  url: (value: string) => {
    if (!value) return "URL is required";
    if (!/^(http(s)?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(value)) return "Invalid URL format";
    return "";
  },

  taxId: (value: string) => {
    if (!value) return "EIN/Tax ID is required";
    if (!/^\d{2}-\d{7}$/.test(value)) return "EIN must be in format XX-XXXXXXX";
    return "";
  },
  password: (value: string) => {
    if (!value) return "Password is required";
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,15}$/.test(value)
    ) {
      return "8–15 chars, include upper, lower, number & special character";
    }
    return "";
  },
};