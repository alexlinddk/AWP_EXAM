import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  const id = form.get("id");

  try {
    const profile = await db.models.Profile.findById(id);
    profile.name = form.get("name");
    profile.bio = form.get("bio");
    profile.tags = form.get("tags");
    profile.websiteUrl = form.get("websiteUrl");

    await profile.save();

    return redirect(`/profiles/${id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export async function loader({ params }) {
  const db = await connectDb();
  const profiles = await db.models.Profile.findById(params.profileid);
  return profiles;
}

export default function UpdateProfile() {
  const profile = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="m-3">
    <h2>Edit profile</h2>
    {actionData?.errorMessage ? (
      <p className="text-red-500 font-bold my-3">{actionData.errorMessage}</p>
    ) : null}
    <Form method="post" className="text-inherit">
      <Input
        type="text"
        name="name"
        id="name"
        placeholder={profile?.name}
        defaultvalue={profile?.name}
      />
      <Input
        type="text"
        name="bio"
        id="bio"
        placeholder={profile?.bio}
        defaultvalue={profile?.bio}
      />
      <Input
        type="text"
        name="websiteUrl"
        id="websiteUrl"
        placeholder={profile?.websiteUrl}
        defaultvalue={profile?.websiteUrl}
      />
      <Input
        type="text"
        name="tags"
        id="tags"
        placeholder={profile?.tags}
        defaultvalue={profile?.tags}
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
