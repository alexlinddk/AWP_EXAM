import { Form, useActionData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession, commitSession } from "~/sessions.server.js";
import { useState } from "react";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    throw redirect("/login");
  }
  return null;
}
export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    throw redirect("/login");
  }
  const form = await request.formData();
  const db = await connectDb();
  try {
    const newProfile = await db.models.Profile.create({
      profileImgUrl: form.get("profileImgUrl"),
      bio: form.get("bio"),
      tags: tagsArray,
      userId: session.get("userId")
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
        <label htmlFor="tags">Choose tags:</label>
        <select id="tags" name="tags">
          <option value="JavaScript" onClick={(e) => tagsArray.push(e.target.value)}>JavaScript</option>
          <option value="C#" onClick={(e) => tagsArray.push(e.target.value)}>C#</option>
          <option value="HTML" onClick={(e) => tagsArray.push(e.target.value)}>HTML</option>
          <option value="CSS" onClick={(e) => tagsArray.push(e.target.value)}>CSS</option>
        </select>
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
