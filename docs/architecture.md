# ARCHITECTURE

## Architecture Goal

SSC menggunakan architecture yang modular agar mudah dikembangkan oleh team dan AI coding agent.

Architecture harus memisahkan:

- UI
- business logic
- data access
- authentication
- AI
- notification
- validation

---

# Application Layers

```text
Client / Browser
      |
      v
Next.js Application
      |
      +----------------+
      |                |
      v                v
UI Components       Server Logic
                       |
              +--------+--------+
              |        |        |
              v        v        v
           Database   AI    Notification