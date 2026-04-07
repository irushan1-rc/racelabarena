export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const body = req.body || {};

  const username =
    body.supporter_name ||
    body.payer_email ||
    "anonymous";

  const amount = Number(body.support_price || 0);

  let tier = "Supporter";
  if (amount >= 10) tier = "Race sponsor";
  else if (amount >= 5) tier = "Upgraded the build";
  else if (amount >= 2) tier = "Charged the battery";

  await fetch("https://szfjzymqmiayvqkhkpuk.supabase.co/rest/v1/supporters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": process.env.SUPABASE_SECRET_KEY,
      "Authorization": `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      username,
      amount,
      tier
    })
  });

  return res.status(200).json({ success: true });
}
