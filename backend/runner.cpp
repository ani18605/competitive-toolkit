#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    bool directed, weighted;
    cin >> n >> m >> directed >> weighted;

    vector<vector<pair<int, int>>> adj(n);

    for (int i = 0; i < m; ++i) {
        int u, v, w = 1;
        cin >> u >> v;
        if (weighted) cin >> w;

        if (u < 0 || u >= n || v < 0 || v >= n) {
            cerr << "Invalid edge: " << u << " -> " << v << "\n";
            return 1;  // Exit with error
        }

        adj[u].emplace_back(v, w);
        if (!directed) adj[v].emplace_back(u, w);
    }


    for (int i = 0; i < n; ++i) {
        cout << i << ": ";
        for (auto [v, w] : adj[i]) {
            cout << v << " " << (weighted ? to_string(w) + " " : "");
        }
        cout << '\n';
    }

    return 0;
}
