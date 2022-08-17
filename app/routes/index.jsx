import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/sessions.server.js";
import { Link, Outlet, useSearchParams } from "react-router-dom";

export async function loader({ request }) {
  const db = await connectDb();
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");
  const query = url.searchParams.get("query");
  const profiles = await db.models.Profile.find(
    query
      ? {
          $or: [
            { name: { $regex: new RegExp(query, "i") } },
            { tags: {  $regex: new RegExp(query, "i") } },
          ],
        }
      : {}
  ).sort({
    [sort]: 1,
  });

  return profiles;
}

export default function Home() {
  const profiles = useLoaderData();
  const [searchParams] = useSearchParams();

  return (
    <div className="col-span-2 mb-5 list-none pl-0 text-slate-800">
    <div className="bg-slate-100">
        <Form className="group relative" method="GET">
          <svg
            width="20"
            height="20"
            fill="currentColor"
            className="absolute left-4 top-7 -mt-2.5 pointer-events-none"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            />
          </svg>
          <input
            className="w-full appearance-none text-sm leading-6 py-4 pl-12 pr-4"
            type="text"
            name="query"
            aria-label="Filter projects"
            placeholder="Filter projects..."
            defaultValue={searchParams.get("query")}
          />
        </Form>
      </div>
      <h1 className="text-3xl font-bold text-slate-800 m-8">
        Welcome {profiles?.name}
      </h1>
      <p className="text-slate-800 mx-8">List of available renters</p>
      <div className="grid grid-cols-3">
        <div className="flex col-span-2">
          {profiles.map((profile) => {
            const createdAt = new Date(profile.createdAt).toLocaleDateString(
              "da-DK",
              {
                dateStyle: "long",
              }
            );
            return (
              <div className="clear-both m-8 pt-4 text-sm" key={profile._id}>
                <div className="card shadow-md w-72 m-9 p-9 hover:shadow-blue-300 active:shadow-blue-500">
                  <div className="rounded-full overflow-hidden mb-5">
                    <img src={`https://avatars.dicebear.com/api/adventurer-neutral/${profile.name}.svg?background=variant02`} />
                  </div>
                  <div className="">
                    <p className="font-bold">Name</p>
                    <p className="mb-5">{profile.name}</p>
                    <p className="font-bold">Bio</p>
                    <p className="rounded bg-slate-200 p-3 mb-5 truncate">{profile.bio}</p>
                    <p className="font-bold">Tags</p>
                    <p className="mb-5">{profile.tags}</p>
                    <p className="font-bold">Creation date</p>
                    <p className="mb-5">{createdAt}</p>
                    <Link to={`/profiles/${profile._id}`} className="bg-slate-200 rounded p-3">Got to profile</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Input({ ...rest }) {
  return (
    <input
      {...rest}
      className="block my-3 border rounded px-2 py-1 w-full lg:w-1/2 bg-white border-zinc-300"
    />
  );
}
