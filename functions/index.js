const functions = require("firebase-functions");
const admin = require("firebase-admin");
const algoliasearch = require("algoliasearch");

const ALGOLIA_ID = functions.config().algolia.id;
const ALGOLIA_KEY = functions.config().algolia.key;

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_KEY);
const usersIndex = client.initIndex("users");
const postsIndex = client.initIndex("posts");
const asksIndex = client.initIndex("asks");

admin.initializeApp();

exports.onWriteUser = functions.firestore
    .document("users/{userId}")
    .onWrite((change, context) => {
      const {userId} = context.params;
      const user = change.after.data();
      usersIndex.saveObject({
        objectID: userId,
        uid: user.uid,
        user_name: user.user_name,
        description: user.description,
        icon_name: user.icon_name,
        icon_path: user.icon_path,
        favo_post_count: user.favo_post_count,
        favo_ask_count: user.favo_ask_count,
        favorite_place: user.favorite_place,
        favorite_team: user.favorite_team,
        favorite_player: user.favorite_player,
        favo_count: user.favo_count,
        is_show: user.is_show,
        created_at: user.created_at,
      });
    });
exports.onWritePost = functions.firestore
    .document("users/{userId}/posts/{postId}")
    .onWrite((change, context) => {
      const {postId} = context.params;
      const post = change.after.data();
      postsIndex.saveObject({
        objectID: postId,
        post_id: post.post_id,
        uid: post.uid,
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

exports.onWriteAsk = functions.firestore
    .document("users/{userId}/asks/{askId}")
    .onWrite((change, context) => {
      const {askId} = context.params;
      const ask = change.after.data();
      asksIndex.saveObject({
        objectID: askId,
        ask_id: ask.ask_id,
        uid: ask.uid,
        stadium: ask.stadium,
        text: ask.text,
        tags: ask.tags,
        is_asking: ask.is_asking,
        favo_count: ask.favo_count,
        created_at: ask.created_at,
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
