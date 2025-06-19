package main

import (
	"data-vault/handler"
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/auth", handler.RedisAuthHandler)

	http.HandleFunc("/set", handler.SetHandler)
	http.HandleFunc("/get", handler.GetHandler)
	http.HandleFunc("/me", handler.MeHandler)
	http.HandleFunc("/keys", handler.KeysHandler)
	http.HandleFunc("/delete", handler.DeleteHandler)
	http.HandleFunc("/expire", handler.ExpireHandler)

	fmt.Println("Vault API running on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
