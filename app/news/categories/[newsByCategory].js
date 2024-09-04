import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getTopNewsByCountry } from "../../../lib/api/api";

const CountryNews = () => {
  // Get the country parameter from the URL
  const { country } = useLocalSearchParams();
  
  // Fetch news based on the country
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["newsByCountry", country], // Make sure the query key includes the country
    queryFn: () => getTopNewsByCountry(country), // Fetch data using the country parameter
  });

  const router = useRouter();

  // Display loading indicator while fetching data
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c669f" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Display error message if fetching data fails
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  // Log fetched data for debugging
  console.log("Fetched Country News Data:", data);

  // Check if articles exist and are in an array format
  const articles = Array.isArray(data?.articles) ? data.articles : [];

  // Handle scenario where no articles are available
  if (articles.length === 0) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>No articles available for {country}.</Text>
      </View>
    );
  }

  // Render news articles if data is available
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{country.toUpperCase()} News</Text>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.articleContainer}
            onPress={() =>
              router.push({
                pathname: `/news/details`,
                params: {
                  title: item.title,
                  description: item.description,
                  content: item.content,
                  urlToImage: item.urlToImage,
                },
              })
            }
          >
            {item.urlToImage ? (
              <Image
                source={{ uri: item.urlToImage }}
                style={styles.articleImage}
              />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CountryNews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  articleContainer: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  articleImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#ddd",
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  articleDescription: {
    fontSize: 14,
    color: "#555",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#4c669f",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
    textAlign: "center",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
});
