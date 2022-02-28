const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

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
