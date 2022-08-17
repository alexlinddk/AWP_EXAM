import { useLoaderData, useCatch, Link, Form, useParams } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "../../sessions.server";

export async function action({ request, params }) {
  const form = await request.formData();
  const action = form.get("_action");
  const db = await connectDb();

  if (action === "delete") {
    try {
      await db.models.Profile.findByIdAndDelete(params.profileId);
      return redirect(`/`);
    } catch (error) {
      return json(
        { errors: error.errors, values: Object.fromEntries(form) },
        { status: 400 }
      );
    }
  }
  return null;
}

export async function loader({ params, request }) {
  const db = await connectDb();
  
  const profile = await db.models.Profile.findById(params.profileId);
  if (!profile) {
    throw new Response(`Couldn't find profile with id ${params.profileId}`, {
      status: 404,
    });
  }
  return json(profile);
}

export default function ProfilePage() {
  const profile = useLoaderData();
  const createdAt = new Date(profile.createdAt).toLocaleDateString(
    "da-DK",
    {
      dateStyle: "long",
    }
  );
  return (
    <div className="flex justify-center">
      <div className="card shadow-md w-72 m-9 p-9">
        <div className="rounded-full overflow-hidden mb-5">
          <img src={`https://avatars.dicebear.com/api/adventurer-neutral/${profile.name}.svg?background=variant02`} />
        </div>
        <div className="">
          <p className="font-bold">Name</p>
          <p className="mb-5">{profile.name}</p>
          <p className="font-bold">Bio</p>
          <p className="rounded bg-slate-200 p-3 mb-5">{profile.bio}</p>
          <p className="font-bold">Tags</p>
          <p className="mb-5">{profile.tags}</p>
          <p className="font-bold">Website</p>
          <a className="mb-5" href={profile.websiteUrl}>{profile.websiteUrl}</a>
          <p className="font-bold">Creation date</p>
          <p className="mb-5">{createdAt}</p>
        </div>
        <Form method="post">
            <input type="hidden" name="id" value={profile._id} />
            <button
              type="submit"
              name="_action"
              value="delete"
              className="bg-transparent hover:bg-red-500 text-red-500 hover:text-white py-2 px-4 border border-red-500 hover:border-transparent"
            >
            Delete profile
            </button>
          </Form>
      </div>
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
