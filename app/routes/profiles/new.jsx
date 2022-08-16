import { Form, useActionData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server.js";


export async function loader({ request }) {
  await requireUserSession(request);
  return null;
}
export async function action({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const form = await request.formData();
  const db = await connectDb();

  try {
    const hasProfile = await db.models.Profile.findOne({
      userId: userId,
    });

    if (hasProfile !== null)
      return json(
        { errors: { hasProfile: "You already created a profile!" } },
        { status: 400 }
      );
    const newProfile = await db.models.Profile.create({
      bio: form.get("bio"),
      tags: form.get("tags"),
      websiteUrl: form.get("websiteUrl"),
      userId: userId,
    });
    return redirect(`/profiles/${newProfile._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}


export default function CreateProfile() {
  const actionData = useActionData();
  let tagsArray = [];
  return (
    <div className="m-3">
      <h2>New profile</h2>
      {actionData?.errorMessage ? (
        <p className="text-red-500 font-bold my-3">{actionData.errorMessage}</p>
      ) : null}
      <Form method="post" className="text-inherit">
        {actionData?.errors.hasProfile && (
          <p className="text-red-500 mt-1 mb-0 py-4">
            {actionData.errors.hasProfile}
          </p>
        )}
        <Input
          type="url"
          name="profileImgUrl"
          id="profileImgUrl"
          placeholder="Profile Image URL"
        />
        <Input
          type="text"
          name="bio"
          id="bio"
          placeholder="Bio"
        />
        <Input
          type="text"
          name="websiteUrl"
          id="websiteUrl"
          placeholder="Website"
        />
        <Input
          type="text"
          name="tags"
          id="tags"
          placeholder="Tags"
        />
        <div className="flex flex-row items-center gap-3">
          <button type="submit" className="my-3 p-2 border rounded">
            Save
          </button>
        </div>
      </Form>
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
