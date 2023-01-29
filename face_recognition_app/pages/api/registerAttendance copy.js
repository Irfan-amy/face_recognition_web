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
        var { name, date, checkInTime, checkOutTime } = req.body;
        if (name && date) {
          //   const { error } = await supabase.from("Staff").insert({ name: name });
          const { data, error } = await supabase
            .from("Attendances")
            .select("*")
            .eq("name", name)
            .eq("date", date);
          console.log(data);

          if (error) {
            res.status(200).json({ error: error });
            return;
          }

          if (data.length == 0) {
            const { error } = await supabase
              .from("Attendances")
              .insert({ name: name, date: date });

            if (error) {
              res.status(200).json({ error: error });
              return;
            }
          }

          if (data[0].checkInTime && data[0].checkOutTime) {
            res.status(200).json({ error: "Already registered!" });
            return;
          }

          if (checkInTime) {
            if (data[0].checkInTime) {
              res.status(200).json({ error: "Already registered! (Check In)" });
              return;
            }

            const { error } = await supabase
              .from("Attendances")
              .update({ checkInTime:checkInTime})
              .eq("name", name).eq("date",date);
            if(!error){
              res.status(200).json({ error: error });
              return;
            }
            else{
              res.status(200).json({ success:true});
              return;
            }
          } else if (checkOutTime) {
            if (!data[0].checkInTime) {
              res.status(200).json({ error: "Not yet registered! (Check In)" });
              return;
            }
            
            if (data[0].checkOutTime) {
              res.status(200).json({ error: "Already registered! (Check Out)" });
              return;
            }

            const { error } = await supabase
              .from("Attendances")
              .update({ checkOutTime:checkOutTime})
              .eq("name", name).eq("date",date);
            if(!error){
              res.status(200).json({ error: error });
              return;
            }
            else{
              res.status(200).json({ success:true});
              return;
            }

          } else res.status(200).json({ error:"unknown" });
        } else {
          console.log(name, date)
          res.status(200).json({ error: "Args not exists" });
        }
      } catch (error) {
        console.log(error);
        res.status(200).json({ error: "error" });
      }
      break;
    default:
      const { data, error } = await supabase
        .from("Attendances")
        .select("*")
        .eq("name", "test12")
        .eq("date", "test");

      console.log(data ?? error);
      res.status(200).json({ error: "Unknown" });
      break;
  }
};
