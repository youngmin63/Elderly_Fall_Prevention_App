import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { apiClient } from "../../api/api"; // 🔐 토큰 자동 설정된 클라이언트

export default function CommunityScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [likeStates, setLikeStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await apiClient.get("/api/community/posts");
      setPosts(res.data);
    } catch (e) {
      console.error("❌ 게시글 불러오기 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async () => {
    try {
      const results = await Promise.all(
        posts.map(async (post) => {
          const res = await apiClient.get(
            `/api/community/posts/${post.id}/likes`
          );
          return { postId: post.id, ...res.data };
        })
      );
      setLikeStates(
        results.reduce((acc, curr) => {
          acc[curr.postId] = { liked: curr.liked, count: curr.likeCount };
          return acc;
        }, {})
      );
    } catch (e) {
      console.error("❌ 좋아요 상태 불러오기 실패:", e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) fetchLikes();
  }, [posts]);

  const toggleLike = async (postId) => {
    try {
      const res = await apiClient.post(`/api/community/posts/${postId}/like`);
      const { liked, likeCount } = res.data;
      setLikeStates((prev) => ({
        ...prev,
        [postId]: { liked, count: likeCount },
      }));
    } catch (e) {
      console.error("❌ 좋아요 토글 실패:", e);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={styles.card}>
      <Text style={styles.exercise}>{item.exerciseName}</Text>
      <Text style={styles.content} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.bottomRow}>
        <Text style={styles.meta}>
          {item.username} · {formatDate(item.createdAt)}
        </Text>
        <TouchableOpacity
          onPress={() => toggleLike(item.id)}
          style={styles.likeButton}
        >
          <Ionicons
            name={likeStates[item.id]?.liked ? "heart" : "heart-outline"}
            size={20}
            color={likeStates[item.id]?.liked ? "#EF4444" : "#9CA3AF"}
          />
          <Text style={styles.likeCount}>
            {likeStates[item.id]?.count || 0}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>커뮤니티</Text>
        <TouchableOpacity
          style={styles.addIconButton}
          onPress={() => navigation.navigate("FriendAddScreen")}
        >
          <Ionicons name="person-add-outline" size={22} color="#3182F6" />
          <Text style={styles.addIconText}>친구 추가</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalBox}>
            {selectedPost && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedPost.exerciseName}
                </Text>
                <Text style={styles.modalUser}>
                  {selectedPost.username} · {formatDate(selectedPost.createdAt)}
                </Text>
                <Text style={styles.modalContent}>{selectedPost.content}</Text>
              </>
            )}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F2F3F6" },
  header: {
    fontSize: 22,
    fontWeight: "700",
 
    
    paddingBottom: 10,
    marginTop: 40,
    marginBottom: 24,
    color: "#222",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    marginTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  exercise: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    fontSize: 12,
    color: "#888",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 8,
  },
  likeCount: {
    marginLeft: 4,
    fontSize: 13,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#222",
  },
  modalUser: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  modalContent: {
    fontSize: 15,
    color: "#333",
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F2F3F6",
    borderRadius: 12,
  },
  closeButtonText: {
    fontSize: 14,
    color: "#3182F6",
    fontWeight: "500",
  },
  addIconButton: {
    flexDirection: "row",       // 아이콘과 텍스트 나란히
    alignItems: "center",
    gap: 4,                     // React Native 0.71 이상이면 가능
  },
  
  addIconText: {
    fontSize: 14,
    color: "#3182F6",
    fontWeight: "500",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },

 
});
