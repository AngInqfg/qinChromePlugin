
// Use the provided base URL for the cloud function
const API_BASE_URL = "https://fc-mp-d2710277-d07d-462e-99b0-59276137c9a6.next.bspapp.com/q-chrome-plugin";

/**
 * Call the cloud function
 * @param {string} action - The action to perform (login, register)
 * @param {object} data - The data to send
 */
async function callCloudFunction(action, data) {
  try {
    const response = await fetch(API_BASE_URL + "/" + action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // uniCloud cloud object URLization expects the parameters as the JSON body
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return {
      code: -1,
      msg: error.message || "Network Error"
    };
  }
}

export const login = async (username, password) => {
  return callCloudFunction('login', { username, password });
};

export const register = async (username, password, nickname) => {
  return callCloudFunction('register', { username, password, nickname });
};

export const getList = async (user_id) => {
  return callCloudFunction('getList', { user_id });
};

export const updateList = async (user_id, list) => {
  return callCloudFunction('updateList', { user_id, list });
};

export const removeSite = async (user_id, key) => {
  return callCloudFunction('removeSite', { user_id, key });
};
