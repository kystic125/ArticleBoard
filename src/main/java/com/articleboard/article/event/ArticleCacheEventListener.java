package com.articleboard.article.event;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class ArticleCacheEventListener {

    private final CacheManager cacheManager;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onArticlePopularized(ArticlePopularizedEvent event) {
        evictPopularCache();
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onArticlePopularBlocked(ArticlePopularBlockedEvent event) {
        evictPopularCache();
    }

    private void evictPopularCache() {
        var cache = cacheManager.getCache("popularArticles");
        if (cache != null) {
            cache.clear();
        }
    }
}
