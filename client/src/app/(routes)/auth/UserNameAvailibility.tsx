async function checkUserTaken(username: string) {
  try {
    const res = await fetch("http://127.0.0.1:8000/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      throw new Error("Network res was not ok");
    }

    const data = await res.json();
    console.log(data);
    // Assuming the API returns a boolean `available` field
    if (data.data) {
      console.log(`${username} is taken.`);
    }

    return data.data;
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false;
  }
}

export default checkUserTaken;
