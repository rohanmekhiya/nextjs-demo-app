"use client";

import { useRouter } from "next/navigation";

export default function RemoveBtn({ productId }) {
    const router = useRouter();
    const removeTopic = async function (id) {
        const confirmed = confirm("Are you sure?");

        if (confirmed) {
            const res = await fetch(`/api/product?id=${id}`, {
                method: "DELETE",
            });
            console.log(res);

            if (res.ok) {
                router.refresh();
            }
        }
    };

    return (
        <button onClick={() => removeTopic(productId)} className="text-red-400 ml-8 p-4 bg-yellow-500 font-bold rounded-xl">
            DELETE
        </button>
    );
}
