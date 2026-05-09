import os, asyncio, aiohttp
from dotenv import load_dotenv

load_dotenv()

UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
BASE_URL            = "https://api.unsplash.com"
_image_cache: dict  = {}


async def fetch_image_url(keyword: str, orientation: str = "landscape") -> str | None:
    if keyword in _image_cache:
        return _image_cache[keyword]

    headers = {"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"}
    params  = {
        "query":       keyword,
        "orientation": orientation,
        "per_page":    5,
        "order_by":    "relevant",
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{BASE_URL}/search/photos",
                headers=headers,
                params=params,
                timeout=aiohttp.ClientTimeout(total=10),
            ) as resp:
                if resp.status != 200:
                    return None
                data    = await resp.json()
                results = data.get("results", [])
                if not results:
                    return None
                # Pick a varied result to avoid repetition
                url = results[min(2, len(results)-1)]["urls"]["regular"]
                _image_cache[keyword] = url
                return url
    except Exception as e:
        print(f"Unsplash error for '{keyword}': {e}")
        return None


async def fetch_images_for_slides(slides: list, max_images: int = 5) -> dict:
    """Returns {slide_index: image_url} for slides that have image_keyword."""
    tasks = []
    idx_map = []

    for i, slide in enumerate(slides):
        kw = slide.get("image_keyword")
        if kw and slide.get("type") in ("title", "content", "conclusion", "statistic"):
            tasks.append(fetch_image_url(kw))
            idx_map.append(i)
        if len(tasks) >= max_images:
            break

    results = await asyncio.gather(*tasks)
    return {idx_map[i]: url for i, url in enumerate(results) if url}
