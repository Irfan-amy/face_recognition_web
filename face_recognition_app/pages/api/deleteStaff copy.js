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
    case "POST":
      try {
        var { name } = req.body;
        const { data, error } = await supabase.storage.from("images").list("", {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });
        if (!name) {
          res.status(400).json({ error: "name undefined " });
          return;
        }
        if (!error) {
          if (!data.find((el) => el.name == name + ".jpg")) {
            const { error } = await supabase
              .from("Staff")
              .delete()
              .eq("name", name);
            if (!error) res.status(200).json({ success: true });
            else res.status(400).json({ error: error.toString() });
          } else {
            const { data, error } = await supabase.storage
              .from("images")
              .remove([name + ".jpg"]);
            if (!error && data) {
              const { error } = await supabase
                .from("Staff")
                .delete()
                .eq("name", name);

              if (!error) res.status(200).json({ success: true });
              else res.status(400).json({ error: error.toString() });
            } else if (error) res.status(400).json({ error: error.toString() });
            else res.status(400).json({ error: "Logic Error" });
          }
        } else res.status(400).json({ error: error.toString() });
        // const { data, error } = await supabase.from("Staff").select();
      } catch (error) {
        res.status(400).json({ error: error.toString() });
      }
      break;
    default:
      res.status(400).json({ error: "Unknown" });
      break;
  }
};
