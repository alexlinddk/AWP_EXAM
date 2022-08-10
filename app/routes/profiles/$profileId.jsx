import { useLoaderData, useCatch } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const profile = await db.models.Profile.findById(params.profileId);
  if (!profile) {
    throw new Response(`Couldn't find profile with id ${params.profileId}`, {
      status: 404,
    });
  }
  if (userId != profile.userId) {
    throw new Response(`Profile with id ${params.profileId} doesn't belong to the user`, {
      status: 403,
    });
  }
  return json(profile);
}

export default function ProfilePage() {
  const profile = useLoaderData();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{profile._id}</h1>
      <code>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </code>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
