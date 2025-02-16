import { Router, Route } from "@solidjs/router";
import home from "./pages/home";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";
import SignUp from "./pages/SignUp";
import CreatePost from "./components/CreatePost";
import { A } from "@solidjs/router";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { Show } from "solid-js";
import EditPost from "./components/EditPost";
import ManageCategories from "./components/ManageCategories";
import Category from "./components/Category";

export default function App() {
  return (
    <AuthProvider>
      <Router root={Layout}>
        <Route path="/" component={home} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signout" component={SignOut} />
        <Route path="/signup" component={SignUp} />
        <Route path="/create-post" component={CreatePost} />
        <Route path="/edit-post/:id" component={EditPost} />
        <Route path="/manage-categories" component={ManageCategories} />
        <Route path="/category/:id" component={Category} />
      </Router>
    </AuthProvider>
  );
}

function Layout(props) {
  const appName = import.meta.env.VITE_APP_NAME || "Osobni Blog";
  const session = useAuth();

  return (
    <>
      <div class="p-4 flex flex-col gap-4">
        <header class="bg-gradient-to-r from-orange-300 to-red-400 p-4 rounded-lg shadow-md text-white">
          <div class="text-4xl font-bold uppercase text-center">{appName}</div>
          <nav class="mt-4 flex justify-center gap-4">
            <A href="/" class="bg-white text-orange-500 px-4 py-2 rounded shadow hover:bg-orange-100">
              Naslovnica
            </A>
            <Show when={!session()}>
              <A href="/signin" class="bg-white text-orange-500 px-4 py-2 rounded shadow hover:bg-orange-100">
                Prijava
              </A>
            </Show>
            <Show when={session()}>
              <A href="/signout" class="bg-white text-orange-500 px-4 py-2 rounded shadow hover:bg-orange-100">
                Odjava
              </A>
            </Show>
            <Show when={session()}>
              <A href="/create-post" class="bg-white text-orange-500 px-4 py-2 rounded shadow hover:bg-orange-100">
                Nova objava
              </A>
            </Show>
            <Show when={session()}>
              <A href="/manage-categories" class="bg-white text-orange-500 px-4 py-2 rounded shadow hover:bg-orange-100">
                Upravljanje kategorijama
              </A>
            </Show>
          </nav>
        </header>

        <main class="min-h-[75vh] w-10/12 mx-auto my-6 bg-gray-50 p-6 rounded-lg shadow-md">
          {props.children}
        </main>

        <footer class="text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Petar Šarec. Sva prava pridržana.
        </footer>
      </div>
    </>
  );
}
