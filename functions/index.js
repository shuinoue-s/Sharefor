const functions = require("firebase-functions");
const admin = require("firebase-admin");
const algoliasearch = require("algoliasearch");

const ALGOLIA_ID = functions.config().algolia.id;
const ALGOLIA_KEY = functions.config().algolia.key;

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_KEY);
const postsIndex = client.initIndex("posts");

admin.initializeApp();

exports.onWritePost = functions.firestore
    .document("users/{userId}/posts/{postId}")
    .onWrite(async (change, context) => {
      const {userId, postId} = context.params;
      const post = change.after.data();
      const db = admin.firestore();
      const userRef = db.collection("users").doc(userId);
      const user = await userRef.get();
      functions.logger.log("Hello from info. Here's an object:", user);
      postsIndex.saveObject({
        objectID: postId,
        post_id: post.post_id,
        uid: post.uid,
        user_name: post.user_name,
        title: post.title,
        body: post.body,
        file_name: post.file_name,
        file_path: post.file_path,
        geopoint: post.geopoint,
        tags: post.tags,
        favo_count: post.favo_count,
        is_show: post.is_show,
        created_at: post.created_at,
      });
    });

// いいね機能
exports.postLiked = functions.firestore
    .document("users/{userId}/posts/{postId}/likedUsers/{likeduserId}")
    .onCreate((snapshot, context) => {
      admin
          .firestore()
          .collection("users")
          .doc(context.params.userId)
          .collection("posts")
          .doc(context.params.postId)
          .update({favo_count: admin.firestore.FieldValue.increment(1)});
    });

exports.postUnliked = functions.firestore
    .document("users/{userId}/posts/{postId}/likedUsers/{likeduserId}")
    .onDelete((snapshot, context) => {
      admin
          .firestore()
          .collection("users")
          .doc(context.params.userId)
          .collection("posts")
          .doc(context.params.postId)
          .update({favo_count: admin.firestore.FieldValue.increment(-1)});
    });

exports.likePost = functions.runWith({memory: "1GB"})
    .firestore.document("users/{userId}/likedPosts/{likedPostId}")
    .onCreate((snapshot, context) => {
      admin
          .firestore()
          .collection("users")
          .doc(context.params.userId)
          .update({favo_post_count: admin.firestore.FieldValue.increment(1)});
    });

exports.unlikePost = functions.firestore
    .document("users/{userId}/likedPosts/{likedPostId}")
    .onDelete((snapshot, context) => {
      admin
          .firestore()
          .collection("users")
          .doc(context.params.userId)
          .update({favo_post_count: admin.firestore.FieldValue.increment(-1)});
    });

exports.askLiked = functions.firestore
    .document("users/{userId}/asks/{askId}/likedUsers/{likeduserId}")
    .onCreate((snapshot, context) => {
      admin
          .firestore()
          .collection("users")
          .doc(context.params.userId)
          .collection("asks")
          .doc(context.params.askId)
          .update({favo_count: admin.firestore.FieldValue.increment(1)});
    });

exports.askUnliked = functions.firestore
    .document("users/{userId}/asks/{askId}/likedUsers/{likeduserId}")
    .onDelete((snapshot, context) => {
      admin
          .firestore()
          .collection("users")
          .doc(context.params.userId)
          .collection("asks")
          .doc(context.params.askId)
          .update({favo_count: admin.firestore.FieldValue.increment(-1)});
    });

exports.likeAsk = functions.runWith({memory: "1GB"})
    .firestore.document("users/{userId}/likedAsks/{likedAskId}")
    .onCreate((snapshot, context) => {
      admin
          .firestore()
          .collection("users")
          .doc(context.params.userId)
          .update({favo_ask_count: admin.firestore.FieldValue.increment(1)});
    });

exports.unlikeAsk = functions.firestore
    .document("users/{userId}/likedAsks/{likedAskId}")
    .onDelete((snapshot, context) => {
      admin
          .firestore()
          .collection("users")
          .doc(context.params.userId)
          .update({favo_ask_count: admin.firestore.FieldValue.increment(-1)});
    });
