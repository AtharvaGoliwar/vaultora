package main

import (
	"data-vault/handler"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.Use(corsMiddleware)
	r.HandleFunc("/auth", handler.RedisAuthHandler)

	r.HandleFunc("/set", handler.SetHandler)
	r.HandleFunc("/get", handler.GetHandler)
	r.HandleFunc("/me", handler.MeHandler)
	r.HandleFunc("/keys", handler.KeysHandler)
	r.HandleFunc("/delete", handler.DeleteHandler)
	r.HandleFunc("/expire", handler.ExpireHandler)

	fmt.Println("Vault API running on http://localhost:8080")
	http.ListenAndServe(":8080", corsMiddleware(r))
}
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Username")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
