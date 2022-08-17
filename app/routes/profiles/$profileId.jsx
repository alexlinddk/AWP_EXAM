import { useLoaderData, useCatch } from "@remix-run/react";
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
  const session = await requireUserSession(request);
  const userId = session.get("userId");
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
      <div>
        <img src="https://avatars.dicebear.com/api/male/{}.svg" />
      </div>
      <div>
        
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
