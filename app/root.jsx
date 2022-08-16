import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styles from "~/tailwind.css";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/sessions.server.js";
import { json } from "@remix-run/node";


export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const profile = await db.models.Profile.findOne({
    userId: session.get("userId"),
  });
  const hasProfile = await db.models.Profile.findOne({
    userId: session.get("userId"),
  });
  return json({
    profileId: profile ? profile._id : null,
    hasProfile: hasProfile ? true : false,
  });

}
export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Remix + MongoDB",
    viewport: "width=device-width,initial-scale=1",
  };
}

export default function App() {
  const { profileId, hasProfile } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-slate-800 font-sans p-4">
        <header className="pb-3 mb-4 border-b-2">
          <Link to="/" className="hover:underline text-blue-600">
            Home
          </Link>
          <Link to="/profiles/new" className="ml-3 hover:underline text-blue-600">
            New profile
          </Link>
          <Link to="/register" className="ml-3 hover:underline text-blue-600">
            Register
          </Link>
          <Link to="/login" className="ml-3 hover:underline text-blue-600">
            Log in
          </Link>
          <Link to="/logout" className="ml-3 hover:underline text-blue-600">
            Log out
          </Link>
          {/* <Link to="/seed" className="ml-3 hover:underline text-blue-600">
            Seed
          </Link> */}
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
