import {useState} from "react";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { customFetch } from '../modules/utils.js';
const API_ROOT_INTERNAL = "http://url-shortener-back:3000";
const API_ROOT_EXTERNAL = "http://localhost:3003";

export async function getServerSideProps(context) {
  try {
    const res = await fetch(API_ROOT_INTERNAL + '/users/me')
    const json = await res.json()

    return {
      props: json,
    }
  }
  catch (e) {
    return {
      props: {
        error: e.toString(),
      },
    }
  }
}

const getAuth = async () => {
  const auth = await customFetch({
    uri: API_ROOT_EXTERNAL + '/users/me',
  });

  return auth;
}

const postUrlToShorten = async (full, shortened) => {
  const response = await customFetch({
    method: "POST",
    content: {
      full,
      shortened,
    },
    uri: API_ROOT_EXTERNAL + '/url',
  });

  return response;
}

async function doLogin(username, password) {
  await customFetch({
    method: "POST",
    uri: API_ROOT_EXTERNAL + '/auth/login',
    content: { username, password },
  });
}

const AuthForm = ({refreshUserInfo}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
// TODO check que les champs ne sont pas vides avant de les envoyer au serveur
    await doLogin(username, password);
// TODO traiter les 401 (bad login and/or password)
    await refreshUserInfo();
  }
  return (
    <div>
      <input name="username" type="text" placeholder='email' value={username} onChange={(e) => setUsername(e.target.value)}></input>
      <input name="password" type="password" placeholder='mot de passe' value={password} onChange={(e) => setPassword(e.target.value)}></input>
      <button onClick={() => login()}>Se connecter / S'enregistrer</button>
    </div>
  );
}

const ShortenerFormCreationPresenter = ({ full, shortened, onFullChange, onShortenedChange, onSubmit }) => {
  return (
    <div>
      <table>
        <tbody>
        <tr>
            <td>URL à raccourcir (doit commencer par "http://" ou "https://"):</td>
            <td><input type="text" name={full} value={full} onChange={onFullChange} /></td>
          </tr>
          <tr>
            <td>Personnaliser l'URL raccourcie (facultatif):</td>
            <td><input type="text" name={shortened} value={shortened} onChange={onShortenedChange} /></td>
          </tr>
        </tbody>
      </table>
      <button onClick={onSubmit}>Créer</button>
    </div>
  )
}

const ShortenerFormCreatedPresenter = ({ full, shortened }) => {
  return (
    <div>
      <table>
        <tbody>
        <tr>
            <td>URL initiale:</td>
            <td><p>{full}</p></td>
          </tr>
          <tr>
            <td>URL raccourcie:</td>
            <td><a href={shortened}>{shortened}</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const ShortenerForm = ({ data }) => {
  const [full, setFull] = useState("");
  const [shortened, setShortened] = useState("");
  const [created, setCreated] = useState("");

// TODO validate onFullChange: must be an URL
  const onFullChange = (e) => setFull(e.target.value);
// TODO validate onShortenedChange: must be an URIComponent
  const onShortenedChange = (e) => setShortened(e.target.value);
  const onSubmit = () => {
    (async () => {
      const response = await postUrlToShorten(full, shortened);
// TODO handle request failure, for example if URL already exists
      const {full: newFull, shortened: newShortened} = response;
      setFull(newFull);
      setShortened(newShortened);
      setCreated(true);
    })();
  };

  if (created) {
    return <ShortenerFormCreatedPresenter
      full={full}
      shortened={shortened}
    />
  }

  return <ShortenerFormCreationPresenter
    full={full}
    shortened={shortened}
    onFullChange={onFullChange}
    onShortenedChange={onShortenedChange}
    onSubmit={onSubmit}
  />
}

const ShortenerView = ({ data }) => {
  if (!data?.name) {
    return (
      <div>
        <h2>Non connecté</h2>
      </div>
    );
  }

  return <ShortenerForm />;
}

const AuthInfo = ({ data, error, refreshUserInfo }) => {
  if (error) return <div>Failed to load ({error})</div>
  if (!data?.name) {
    return <AuthForm refreshUserInfo={refreshUserInfo} />;
  }

  const logout = async () => {
    await customFetch({ uri: API_ROOT_EXTERNAL + '/auth/logout' });
    await refreshUserInfo();
  }

  return (
    <div>
      <h1>Bienvenue, {data.name}.</h1>
      <button onClick={() => logout()}>déconnexion</button>
    </div>
  );
}

export default function Home({ data, error }) {
  const [state, setState] = useState({ data, error });
  const refreshUserInfo = async () => {
    try {
      const { data, error } = await getAuth();
      setState({data, error});
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>URL Shortener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>URL Shortener</h1>
        <AuthInfo
          data={state.data}
          error={state.error}
          refreshUserInfo={refreshUserInfo}
        />
        <ShortenerView data={state.data} />
      </main>
    </div>
  )
}
