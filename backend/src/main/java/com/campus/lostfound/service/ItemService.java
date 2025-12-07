package com.campus.lostfound.service;

import com.campus.lostfound.dto.CategoryResponse;
import com.campus.lostfound.dto.ItemRequest;
import com.campus.lostfound.dto.ItemResponse;
import com.campus.lostfound.dto.UserResponse;
import com.campus.lostfound.model.Category;
import com.campus.lostfound.model.Item;
import com.campus.lostfound.model.User;
import com.campus.lostfound.repository.CategoryRepository;
import com.campus.lostfound.repository.ItemRepository;
import com.campus.lostfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public ItemResponse createItem(ItemRequest itemRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = null;
        if (itemRequest.getCategoryId() != null) {
            category = categoryRepository.findById(itemRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Item item = new Item();
        item.setTitle(itemRequest.getTitle());
        item.setDescription(itemRequest.getDescription());
        item.setItemType(itemRequest.getItemType());
        item.setCategory(category);
        item.setLocation(itemRequest.getLocation());
        item.setDateLostFound(itemRequest.getDateLostFound());
        item.setImageUrls(itemRequest.getImageUrls());
        item.setContactPreference(itemRequest.getContactPreference());
        item.setIsPublic(itemRequest.getIsPublic());
        item.setReward(itemRequest.getReward());
        item.setUser(user);

        Item savedItem = itemRepository.save(item);
        return convertToResponse(savedItem);
    }

    public List<ItemResponse> getUserItems(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return itemRepository.findByUserId(user.getId()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ItemResponse> getAllItems() {
        return itemRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ItemResponse> searchItems(String query) {
        return itemRepository.searchItems(query).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private ItemResponse convertToResponse(Item item) {
        ItemResponse response = new ItemResponse();
        response.setId(item.getId());
        response.setTitle(item.getTitle());
        response.setDescription(item.getDescription());
        response.setItemType(item.getItemType());
        response.setLocation(item.getLocation());
        response.setDateLostFound(item.getDateLostFound());
        response.setImageUrls(item.getImageUrls());
        response.setStatus(item.getStatus());
        response.setContactPreference(item.getContactPreference());
        response.setIsPublic(item.getIsPublic());
        response.setReward(item.getReward());
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());

        if (item.getCategory() != null) {
            response.setCategory(new CategoryResponse(
                    item.getCategory().getId(),
                    item.getCategory().getName(),
                    item.getCategory().getDescription(),
                    item.getCategory().getIcon(),
                    item.getCategory().getColor()
            ));
        }

        if (item.getUser() != null) {
            response.setUser(new UserResponse(
                    item.getUser().getId(),
                    item.getUser().getFirstName(),
                    item.getUser().getLastName(),
                    item.getUser().getEmail(),
                    item.getUser().getStudentId(),
                    item.getUser().getPhoneNumber(),
                    item.getUser().getAvatarUrl()
            ));
        }

        return response;
    }
}