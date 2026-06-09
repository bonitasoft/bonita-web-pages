<script>
    let username = $state('');
    let password = $state('');
    let error = $state(null);
    let loading = $state(false);

    let { onLogin } = $props();

    async function login(event) {
        event.preventDefault();
        loading = true;
        error = null;
        try {
            const response = await fetch('/bonita/loginservice', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    username,
                    password,
                    redirect: 'false',
                }),
            });
            if (response.ok || response.redirected) {
                onLogin();
            } else {
                error = `Login failed (${response.status})`;
            }
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    }
</script>

<div class="container DevLogin">
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">Dev Login — Bonita</h3>
        </div>
        <div class="panel-body">
            {#if error}
                <div class="alert alert-danger">{error}</div>
            {/if}
            <form onsubmit={login}>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input id="username" class="form-control" type="text" bind:value={username} />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input id="password" class="form-control" type="password" bind:value={password} />
                </div>
                <button type="submit" class="btn btn-primary btn-block" disabled={loading}>
                    {loading ? 'Connecting...' : 'Login'}
                </button>
            </form>
        </div>
    </div>
</div>

<style>
    .DevLogin {
        max-width: 400px;
        margin-top: 80px;
    }
</style>
