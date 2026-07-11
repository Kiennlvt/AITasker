import { useEffect, useState } from "react";
import { getCategories } from "../api/categories";

let cache = null;
let inflight = null;

export default function useCategories() {
  const [categories, setCategories] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    if (!inflight) {
      inflight = getCategories()
        .then((data) => {
          cache = data;
          return data;
        })
        .catch(() => {
          inflight = null;
          return [];
        });
    }
    inflight.then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  return { categories, loading };
}
