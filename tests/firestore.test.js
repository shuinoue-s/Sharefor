// import fs from 'fs'
// import { assertSucceeds,initializeTestEnvironment, } from "@firebase/rules-unit-testing"
// import { setDoc } from "firebase/firestore"

// let testEnv = await initializeTestEnvironment({
//   projectId: "demo-project-1234",
//   firestore: {
//     rules: fs.readFileSync("firestore.rules", "utf8"),
//   },
// });

// const alice = testEnv.authenticatedContext("alice");
// await assertSucceeds(setDoc(alice.firestore(), '/users/alice'));