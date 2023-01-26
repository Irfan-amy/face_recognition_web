import { StorageClient } from "@supabase/storage-js";
import { createClient } from "@supabase/supabase-js";
const fs = require("fs");

export default async (req, res) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { data, error } = await supabase.storage.from("images").list("", {
          limit: 5000,
          offset: 0,
        });
        if (!error)
          // res
          //   .status(200)
          //   .json({ staffList: data.map((e) => e.name.replace(".jpg", "")) });
          res.status(200).json({
            staffList: data.map((e) => {
              if (e.name.includes("jpg")) return e.name.replace(".jpg", "");
              else return null;
            }),
          });
        else res.status(400).json({ error: error.toString() });
      } catch (error) {
        res.status(400).json({ error: "Unknown" });
      }
      break;
    default:
      res.status(400).json({ error: "Unknown" });
      break;
  }
};
